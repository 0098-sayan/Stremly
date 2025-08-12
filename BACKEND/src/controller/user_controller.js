import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        { _id: { $nin: currentUser.friends } }, // Exclude friends
        { isOnboarded: true }, // Only include users who are onboarded
      ],
    });
    res.status(200).json( recommendedUsers );
  } catch (error) {
    console.error("Error fetching recommended users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends );
  } catch (error) {
    console.error("Error fetching friends:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendFriendRequest(req,res){
    try {
      const myId = req.user.id;
      const { id: recipientId } = req.params;

        //Prevent sending friend request to self
      if (myId === recipientId) {
        return res.status(400).json({ message: "You cannot send a friend request to yourself." });
      }
      // Check if the recipient exists
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found." });
      }
      // Check if the recipient is already a friend
      if (recipient.friends.includes(myId)) {
        return res.status(400).json({ message: "You are already friends with this user." });
      }
        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
           $or: [
            { sender: myId, recipient: recipientId },
            { sender: recipientId, recipient: myId },]
        })

        if (existingRequest) {
          return res.status(400).json({ message: "Friend request already exists." });
        }

        const friendRequest = await FriendRequest.create({
          sender: myId,
          recipient: recipientId,
        });

        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error sending friend request:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res){
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);


        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        //verify that the current user is the recipient of the request
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each other to friends list
        await User.findByIdAndUpdate(friendRequest.sender, {
          $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
          $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({ message: "Friend request accepted successfully." });

    } catch (error) {

        console.log("Error accepting friend request:", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function getFriendRequest(req, res) {
  try {
    const userId = req.user.id;

    const incomingReqs = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    })
      .populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      recipient: userId,
      status: "accepted",
    })
      .populate("sender", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });

  } catch (error) {
    console.log("Error fetching friend requests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const userId = req.user.id;

    const outgoingReqs = await FriendRequest.find({
      sender: userId,
      status: "pending",
    })
      .populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.log("Error fetching outgoing friend requests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}