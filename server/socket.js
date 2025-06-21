import {Server as SocketIOServer} from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    const disconnect  = (socket) => {
        console.log(`Client Disconnected : ${socket.id}`);
        for(const [userId, socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    // Efvent for sending message on server side
    const sendMessage = async(message) => {
        const senderSocketId  = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
        // we getting sender and recipent socket id from frontend  - If recipent is online we emit the event - but regardless of offline or online we store message in database..

        const createMessage = await Message.create(message);

        // To send message detail to user we need to populate sender and recipent
        const messageData = await Message.findById(createMessage._id).populate("sender", "id firstName lastName image color")
        .populate("recipient", "id firstName lastName image color");

        if(recipientSocketId){
            io.to(recipientSocketId).emit("receiveMessage", messageData);
        }

        if(senderSocketId){
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if(userId){
            userSocketMap.set(userId, socket.id);
            console.log(`User connected : ${userId} with socket ID : ${socket.id}`);
        }else{
            console.log("User ID not provided during connection.")
        }

        socket.on("sendMessage",sendMessage)
        socket.on("disconnect", () => disconnect(socket));
    })
}

export default setupSocket;