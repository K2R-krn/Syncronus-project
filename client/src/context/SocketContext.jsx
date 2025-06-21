import { useAppStore } from "@/store";
import { createContext, useContext, useEffect, useRef } from "react";
import { HOST } from "@/utils/constants";
import { io } from "socket.io-client";



const SocketContext = createContext(null);

export const useSocket = () =>{
    return useContext(SocketContext);
};

export const SocketProvider = ({children}) => {
    const socket = useRef();
    const {userInfo} = useAppStore();

    useEffect(() => {
      if(userInfo){
        socket.current = io(HOST, {
            withCredentials : true,
            query: {userId: userInfo.id},
        });

        socket.current.on("connect", () => {
            console.log("Connected to socket server");
        });


        const handleReceiveMessage = (message) => {
    const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

    console.log("Incoming message payload:", message);
    console.log("Selected chat data:", selectedChatData);

    const getId = (entity) => {
        if (!entity) return undefined;
        if (typeof entity === "string") return entity;
        return entity._id || entity.id;
    };

    const senderId = getId(message.sender);
    const recipientId = getId(message.recipient);

    if (
        selectedChatType !== undefined &&
        (selectedChatData._id === senderId || selectedChatData._id === recipientId)
    ) {
        console.log("message received", message);
        addMessage(message);
    }

    //     const handleReceiveMessage = (message) => {
              
    //         const {selectedChatData, selectedChatType, addMessage} = useAppStore.getState();

    //         console.log("Incoming message payload:", message);
    //         console.log("Selected chat data:", selectedChatData);

    //         const senderId = typeof message.sender === "object" ? message.sender._id : message.sender;
    // const recipientId = typeof message.recipient === "object" ? message.recipient._id : message.recipient;
    // if (
    //     selectedChatType !== undefined &&
    //     (selectedChatData._id === senderId || selectedChatData._id === recipientId)
    // ) {
    //     console.log("message received", message);
    //     addMessage(message);
    // }


        //     if(selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)){
        //         console.log("message reveived", message);
        //         addMessage(message);
        //     }
            
        }

        socket.current.on("receiveMessage", handleReceiveMessage);

        return () => {
            
            socket.current.disconnect();
            
        }
      }
    }, [userInfo]);


    return (
        <SocketContext.Provider value = {socket}>
            {children}
        </SocketContext.Provider>
    )
    
}