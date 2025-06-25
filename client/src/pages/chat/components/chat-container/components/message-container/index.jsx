import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES } from "@/utils/constants";
import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { HOST } from "@/utils/constants";
import {MdFolderZip} from 'react-icons/md';
import {IoMdArrowDown} from 'react-icons/io';
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { ArrowDown, FolderRoot } from "lucide-react";

const MessageContainer = () => {

  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages, setFileDownloadProgress, setIsDownloading, isDownloading, fileDownloadProgress, isUploading, fileUploadProgress}= useAppStore();

  const [showImage, setshowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async() => {
      try{
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, {id:selectedChatData._id}, {withCredentials: true});
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages);
        }
        //  if (response.data.messages) {
        //   // Check if the messages are different before setting them
        //   if (JSON.stringify(response.data.messages) !== JSON.stringify(selectedChatMessages)) {
        //     setSelectedChatMessages(response.data.messages);
        //   }
        // }
      }catch(error){
        console.log({error})
      }
    };

    const getChannelMessages = async () => {
      try{
        const response = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,{ withCredentials: true });
        
        // if (response.data.messages) {
        //   // Check if the messages are different before setting them
        //   if (JSON.stringify(response.data.messages) !== JSON.stringify(selectedChatMessages)) {
        //     setSelectedChatMessages(response.data.messages);
        //   }
        // }

        if(response.data.messages){
            setSelectedChatMessages(response.data.messages);
          }
      }catch(error){
        console.log({error})
      }
    }
    if(selectedChatData._id){
      if(selectedChatType === "contact") getMessages();
      else if(selectedChatType === "channel") getChannelMessages();
    }
  
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);
  

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behaviour: "smooth"});
    }
  }, [selectedChatMessages]);

  // Below check if image or no., if image return true
  const checkIfImage = (filePath) => {
    const imageRegex = 
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
      return imageRegex.test(filePath); 
  };
  const renderMessages = () => {
    let lastDate= null;
    return selectedChatMessages.map((message, index)=> {
      const messageDate = moment(message.timestamp).format("YYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index} >
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}

        </div>
      )
    });
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {responseType: "blob",
      onDownloadProgress:(progressEvent)=>{
        const {loaded,total} = progressEvent;
        const percentCompleted = Math.round((loaded*100)/total);
        setFileDownloadProgress(percentCompleted);
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && ( 
        <div
          className={`${
            message.sender != selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
              : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
        >
          {message.content}
        </div>
      )}
      {message.messageType==="file" && 
            <div className={`${
              message.sender != selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "
                  } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
            >
            {
              checkIfImage(message.fileUrl) 
              ? (<div className="cursor-pointer" onClick={() => {setshowImage(true); setImageURL(message.fileUrl)}}>
                  <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                </div> )
              : (<div className="flex items-center justify-center gap-4">
                  <span className=" bg-[#2a2b33]  text-white/8 text-3xl rounded-full p-3">
                    <MdFolderZip className="text-purple-300 text-3xl" />
                  </span>
                  <span className="break-all text-center">{ message.fileUrl.split('/')}</span>
                  <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => downloadFile(message.fileUrl)}>
                    <IoMdArrowDown />
                  </span>
              </div>)
            }
            </div>
      }
      <div className="text-xs text-gray-600 ">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );


  const renderChannelMessages = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id !== userInfo.id ? 
        "text-left" : "text-right"
      }`}>
        {
          message.messageType === "text" && (
            <div className={`${message.sender._id === userInfo.id ? 
              "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-t-2xl rounded-l-2xl text-left": 
              "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 rounded-t-2xl rounded-r-2xl"
            } border inline-block px-3 py-3 my-1 break-words ml-10`}>
              <div className='md:max-w-[500px] md:min-w-32 max-w-64 min-w-20'>
              {message.content}
              </div>
            </div>
          )
        } 
        
        {
          message.messageType === "file" && (
            <div className={`${message.sender._id === userInfo.id ? 
              "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50": 
              "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block overflow-hidden rounded-2xl my-1 max-w-[50%] break-words`}>

              {checkIfImage(message.fileUrl)? <div className='cursor-pointer' onClick={()=> {
                setshowImage(true);
                setImageURL(message.fileUrl);
              }}>
                <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} alt="" />
              </div> : <div className='flex items-center p-3 justify-center gap-4'>
                <span className='text-white/8 text-3xl bg-black/20 rounded-full p-3'>
                    <FolderRoot size={20} />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className='p-3 text-2xl cursor-pointer transition-all duration-300' onClick={()=>download(message.fileUrl)}>
                  <ArrowDown size={20} />
                </span>

              </div> }

            </div>
          )
        }
        
        {
          message.sender._id !== userInfo.id ? (
            <div className="flex justify-start items-center gap-3">
               <Avatar className="h-8 w-8 rounded-full overflow-hidden ">
                    {
                      message.sender.image && (
                        <AvatarImage
                        src={`${HOST}/${message.sender.image}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                        />
                      )}
                        <AvatarFallback className={`uppercase h-8 w-8  text-lg flex items-center justify-center rounded-full ${getColor( message.sender.color)} `}>
                       {message.sender.firstName ? message.sender.firstName.split("").shift(): 
                         message.sender.email.split("").shift()}
                        </AvatarFallback>

                  </Avatar>
                        <span className='text-sm text-white/60' >
                          {`${message.sender.firstName} ${message.sender.lastName}`}
                        </span>
                        <span className='text-sm text-white/60' >
                        {moment(message.timestamp).format("LT")}
                        </span>
            </div>
          ): (
            <div className='text-sm text-white/60 mt-1' >
            {moment(message.timestamp).format("LT")}
            </div>
          )
        }

        

      </div>
    )
  }
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
        {renderMessages()}

        {(isUploading || isDownloading) && (
      <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-2">
          {isUploading ? "Uploading..." : "Downloading..."}
        </div>
        <div className="w-64 bg-white/20 rounded-full h-3">
          <div
            className="bg-[#8417ff] h-3 rounded-full"
            style={{
              width: `${isUploading ? fileUploadProgress : fileDownloadProgress}%`,
            }}
          ></div>
        </div>
        <div className="text-white mt-2 text-sm">
          {isUploading ? fileUploadProgress : fileDownloadProgress}%
        </div>
      </div>
    )}
    {isUploading && (
  <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center">
    <div className="text-white text-xl mb-2">Uploading...</div>
    <div className="w-64 bg-white/20 rounded-full h-3">
      <div
        className="bg-[#8417ff] h-3 rounded-full"
        style={{ width: `${fileUploadProgress}%` }}
      ></div>
    </div>
    <div className="text-white mt-2 text-sm">{fileUploadProgress}%</div>
  </div>
)}

        <div ref={scrollRef} />
        {
          showImage && 
          <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col" onClick={() => { setshowImage(false); setImageURL(null);}}>
            <div onClick={(e) => e.stopPropagation()}>  
              <img src={`${HOST}/${imageURL}`} className="h-[80vh] w-full bg-cover" />
            </div>
            <div className="flex gap-5 fixed top-0 mt-5">
              <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)} >
                  <IoMdArrowDown />
              </button>
              <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setshowImage(false);
                setImageURL(null);
              }} >
                  <IoCloseSharp />
              </button>
            </div>
          </div>
        }
    </div>
  );
};

export default MessageContainer