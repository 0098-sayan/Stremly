import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const userId = req.user.id;
    // Assuming you have a function to generate a token
    const token = await generateStreamToken(userId);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error generating stream token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}