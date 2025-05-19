import { useAppStore } from "@/store";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {IoArrowBack} from "react-icons/io5"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import {FaPlus, FaTrash} from "react-icons/fa"
import { Input } from "@/components/ui/input";
import { colors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";
import { HOST } from "@/utils/constants";


const Profile = () => {
  
  const navigate = useNavigate();
  const {userInfo, setUserInfo} = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered]= useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(()=>{
    if(userInfo.profileSetup ){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo])

  const validateProfile = () => {
    if(!firstName){
      toast.error("First name is required.");
      return false;
    }
    if(!lastName){
      toast.error("Last name is required.");
      return false;
    }
    return true;
  }

  const saveChanges = async() => {
    if((validateProfile())){
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE, 
          {firstName, lastName, color:selectedColor},
          {withCredentials:true} // make sure this is passed or wont be sending cookies then wont get user id and wont be able to get data
        );
        if(response.status === 200 && response.data){
          setUserInfo({...response.data});
          toast.success("Profile Updated Sucessfully.");
          navigate("/chat");
        }
      } catch (error) {
        
      }
    }
  };

  const handleNavigate = () => {
    if(userInfo.profileSetup){
      navigate("/chat");
    }else{
      toast.error("Please setup Profile.");
    }
  }

  // whenever click on input ref we need to have ref being clin=cked
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if(file){
      const formData  = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(
        ADD_PROFILE_IMAGE_ROUTE, formData,
        {withCredentials:true}
      );
      if(response.status === 200 && response.data.image){
        setUserInfo({...userInfo, image:response.data.image});
        toast.success("Image updated sucessfully.");
      } 
      // Show uploaded image on client side before sending to server
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);  // Tempoorary preview
      }
      reader.readAsDataURL(file);

    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {withCredentials:true});
      if(response.status===200){
        setUserInfo({...userInfo, image:null});
        setImage(null);
        toast.success("Image removed sucessfully.");
      }
    } catch (error) {
      console.log("Image deletion failed: "+error);
    }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div 
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center " 
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={()=> setHovered(false)}
          >  
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? ( 
                <AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black"/> 
              ) : ( 
                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-6xl font-bold border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)} ` }>
                  {firstName 
                    ? firstName.split("").shift() 
                    : userInfo.email.split("").shift()}
                </div>
              ) 
              }
            </Avatar>
            { hovered && ( 
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                  onClick={image ? handleDeleteImage : handleFileInputClick}> 
                {image ? ( 
                  <FaTrash className="text-white text-3xl cursor-pointer"/> 
                ) : (
                   <FaPlus className="text-white text-3xl cursor-pointer" /> 
                )}
              </div>
            )}

            <input type = "file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpeg, .jpg, .webp, .svg" />
          </div>
          
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center"> 
            <div className="w-full flex flex-col gap-4">
              
              <Input placeholder="Email" type="email" disabled value={userInfo.email} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />

              <Input placeholder="First Name" type="text" value={firstName} onChange={(e)=> setFirstName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />

              <Input placeholder="Last Name" type="text" value={lastName} onChange={(e)=> setLastName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />

            </div>

            <div className="w-full flex gap-5">
              {
                colors.map((color,index) => (<div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline outline-white/50 outline-1" : "" }`} 
                key={index}
                onClick={()=> setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button 
          className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          onClick={saveChanges}
          >Save Changes</Button>
        </div>

      </div>
    </div>
  
)};

export default Profile;