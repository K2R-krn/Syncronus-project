import { useState } from "react";
import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {toast} from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";


const Auth = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate(); 

  const {setUserInfo} = useAppStore()
  // console.log(email+password+confirmPassword);

  const validateSignup = () => {
    // Email validation: Regular expression for email format starting with a letter and followed by optional numbers, valid domain like gmail.com
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Password validation: Regular expression for at least one uppercase, one lowercase, one number, and one special character
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if(!email.length) {
      toast.error("Email is Required.");
      return false; 
    }
    if (!emailPattern.test(email)) {
      toast.error("Enter a valid email");
      return false;
    }
    if(!password.length){
      toast.error("Password is required.")
      return false;
    }
    if (!passwordPattern.test(password)) {
      toast.error("Password must be at least 6 characters long, contain uppercase,  lowercase, number, and special character");
      return false;
    }
    if(password !== confirmPassword){
      toast.error("Password and Confirm Password should be same.")
      return false;
    }
    return true;
  }

  const handleSignup = async()=>{
    if(validateSignup()){
      try{
        const response = await apiClient.post(SIGNUP_ROUTE,
          {email, password},
          {withCredentials: true} // only now we can receive jwt cookie.. 
        );
        if(response.status === 201){
          setUserInfo(response.data.user);
          navigate("/profile");
        }
        // console.log({response});
      }catch(error){
        if (error.response) {
          const errorMessage = error.response.data.error || error.response.data.message;
          console.error("Full error response:", error.response?.data);
          console.error("Error response:", error.response?.data);
console.error("Status:", error.response?.status);
console.error("Full error:", error);
          if (errorMessage === "EmailAlreadyExists") {
            toast.error("This email is already registered!");
          } else if (errorMessage === "Email and Password are required") {
            toast.error("Email and password are required!");
          } else {
            toast.error("Signup failed! Please try again.");
          }
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    
    }
  };


  const validateLogin =() => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!email.length) {
      toast.error("Email is Required.");
      return false; 
    }
    if (!emailPattern.test(email)) {
      toast.error("Enter a valid email address.");
      return false;
    }
    if(!password.length){
      toast.error("Password is required.")
      return false;
    }
    return true;
  }
  
  // const handleLogin = async()=>{
  //   if(validateLogin()){
  //     const response = await apiClient.post(LOGIN_ROUTE, {email,password}, {withCredentials: true});
  //     console.log({response});
  //     if(response.data.user.id){
  //       setUserInfo(response.data.user);
  //       if(response.data.user.profileSetup){
  //         toast.success("Login Sucessfull") 
  //         navigate("/chat");

  //       }
  //       else navigate("/profile");
  //     }
  //   }
  // };
  const handleLogin = async () => {
  if (!validateLogin()) return;

  try {
    const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });

    if (response.data.user?.id) {
      setUserInfo(response.data.user);
      toast.success("Login Successful!");

      if (response.data.user.profileSetup) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }
    } else {
      toast.error("Unexpected response. Please try again.");
    }

  } catch (error) {
    // console.log("Login error caught");

    const status = error.response?.status;
    const rawData = error.response?.data;
    const message = typeof rawData === "string" ? rawData : rawData?.message || rawData?.error;

    if (status === 400 && message === "Password is incorrect.") {
      toast.error("Incorrect password.");
    } else if (status === 404 && message === "User with the given email not found.") {
      toast.error("No account found with this email.");
    } else if (status === 400 && message === "Email and Password is required.") {
      toast.error("Email and password are required.");
    } else if (status === 500) {
      toast.error("Server error. Please try again later.");
    } else if (!error.response) {
      toast.error("Cannot connect to server. Check your network.");
    } else {
      toast.error(message || "Login failed. Please try again.");
    }
  }
};

  
  
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw]  md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl"> Welcome </h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center"> Fill in the details to get started with the best chat app !</p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger value="login"
                className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >Login</TabsTrigger>
                <TabsTrigger value="signup"
                className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">

                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={e=>setEmail(e.target.value)}/>

                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={e=>setPassword(e.target.value)}/>

                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>

              </TabsContent> 
              <TabsContent className="flex flex-col gap-5" value="signup">
                
                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={e=>setEmail(e.target.value)}/>

                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={e=>setPassword(e.target.value)}/>

                <Input placeholder="Confirm Password" type="password" className="rounded-full p-6" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/>

                <Button className="rounded-full p-6" onClick={handleSignup}>Sign Up</Button>

              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="hidden xl:flex justify-center items-center">
          <img  src={Background} alt="background login" className="h-[700px] "/>
        </div>
      </div>
    
    </div>
  )
};

export default Auth;