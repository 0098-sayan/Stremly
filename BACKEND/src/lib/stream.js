import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if(!apiKey || !apiSecret) {
  console.error("Stream API key and secret must be provided");
}


const streamClient = StreamChat.getInstance(apiKey, apiSecret);   

export const upsertStreamUser = async (userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error in upserting Stream User:", error);
        
    }
}

export const generateStreamToken = (userId) => {
    try {
       //ensure userId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
        throw new Error("Failed to generate Stream token");
    }
};