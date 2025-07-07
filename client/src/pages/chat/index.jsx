import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts.container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const{
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
    
  const {userInfo, selectedChatType} = useAppStore();
  const navigate = useNavigate();

  useEffect(() => { // Now chat page not accessible if user didnt complete profile...
    // console.log("userInfo:", userInfo);
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
    {
      isUploading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 bg-black/80 flex items-center justify-center gap-5 flex-col backdrop-blur-lg">
        <h5 className="text-5xl anumate-pulse">Uploading File</h5>
        {fileUploadProgress}%
      </div>
    }
    {
      isDownloading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 bg-black/80 flex items-center justify-center gap-5 flex-col backdrop-blur-lg">
        <h5 className="text-5xl anumate-pulse">Downloading File</h5>
        {fileDownloadProgress}%
      </div>
    }
      <ContactsContainer />
      {
        selectedChatType === undefined ? (<EmptyChatContainer />) : (<ChatContainer />)
      }
      {/* <EmptyChatContainer />
      <ChatContainer /> */}
    </div>
  
)};

export default Chat;