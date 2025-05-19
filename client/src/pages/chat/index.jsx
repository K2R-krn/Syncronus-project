import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts.container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {

  const {userInfo} = useAppStore();
  const navigate = useNavigate();

  useEffect(() => { // Now chat page not accessible if user didnt complete profile...
    console.log("userInfo:", userInfo);
    if(!userInfo.profileSetup){
      toast('Please Setup profile to continue.');
      navigate("/profile");
    }
  }, [userInfo, navigate])
  if (!userInfo || !userInfo.email) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {/* <EmptyChatContainer /> */}
      <ChatContainer />
    </div>
  
)};

export default Chat;