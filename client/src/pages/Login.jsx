import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import initializeApp from "@/utils/init"
import { useDispatch } from "react-redux";
import { userLoggedIn } from "@/features/authSlice"; 
import Goomgle from "@/assets/Goomgle.png";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { signInWithPopup } from "firebase/auth";
import { auth, isGoogleAuthAvailable, provider } from "@/utils/firebase";
import axios from "axios";
import apiClient from "@/api/axios";

const Login = () => {
  const [showPassword, isShowPassword] = useState(false);
  const [role, setRole]=useState("student");
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });


  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  /*const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if(registerIsSuccess && registerData){
      toast.success(registerData.message || "Signup successful.")
    }
    if(registerError){
      toast.error(registerError.data.message || "Signup Failed");
    }
    if(loginIsSuccess && loginData){
      toast.success(loginData.message || "Login successful.");
      navigate("/");
    }
    if(loginError){ 
      toast.error(loginError.data.message || "login Failed");
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);*/

  
  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;

    try {
      const response = await action(inputData).unwrap(); //  unwrap the result
      toast.success(response.message || `${type} successful`);

      if (type === "login"||type === "signup") {
        dispatch(userLoggedIn({ user: response.user }));
        await initializeApp();
        // Redirect based on role
        if (response.user.role === "instructor") {
          navigate("/admin/dashboard");
        } else {
          //navigate("/my-learning");
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || `${type} failed`);
    }
  };

  const handleRoleChange = async (role)=>{
    try{
      setSignupInput({...signupInput, role:role});
      setRole(role);
    }catch(error){
      console.error(error);
      toast.error(error?.data?.message || "failed to select role")
    }
  } 

  const googleSignUp = async ()=>{
    if (!isGoogleAuthAvailable) {
      toast.error("Google sign up is not configured locally.");
      return;
    }
    try{
      const response = await signInWithPopup(auth,provider);
      let user = response.user
      let Gname = user.displayName
      let Gemail = user.email
      const result = await apiClient.post("/user/googleauth",{name:Gname, email:Gemail,role:role});
      dispatch(userLoggedIn({ user: result.data.user }));
      await initializeApp();
      if (result.data.user.role === "instructor"){
        navigate("/admin/dashboard");
      }else{
        navigate("/");
      }
      toast.success("signUp successfully")

    }catch(error){
      console.error(error);
      toast.error(error?.message || "Google sign up failed");
    }
  }
    const googleLogin = async ()=>{
    if (!isGoogleAuthAvailable) {
      toast.error("Google login is not configured locally.");
      return;
    }
    try{
      const response = await signInWithPopup(auth,provider);
      let user = response.user
      let Gname = user.displayName
      let Gemail = user.email
      const result = await apiClient.post("/user/googleauth",{name:Gname, email:Gemail,});
      dispatch(userLoggedIn({ user: result.data.user }));
      await initializeApp();
      if (result.data.user.role === "instructor"){
        navigate("/admin/dashboard");
      }else{
        navigate("/");
      }
      toast.success("Logged In successfully")
    }catch(error){
      console.error(error);
      toast.error(error?.message || "Google login failed");
    }
  }
  

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. abc"
                  required
                />
              </div>
              <Label htmlFor="username">Email</Label>
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. abc@gmail.com"
                  required
                />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword? "":"password"}
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. xyz@12"
                  className="pr-15"
                  required
                />
                <button type="button" onClick={()=>isShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white">
                  {showPassword? <FiEye/>:<FiEyeOff/>}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <div className="translate-y-3 flex justify-center gap-6">
                <button className={`border-[1.5px] rounded-2xl p-1 px-4 transition-all duration-200  ${role === "student" ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border-gray-400 text-gray-500 hover:border-gray-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-400"

      }`} onClick={()=>handleRoleChange("student")}>
                  Student
                </button>
                <button className={`border-[1.5px] rounded-2xl p-1 px-4 transition-all duration-200 ${role === "instructor" ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"  : "border-gray-400 text-gray-500 hover:border-gray-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-400"  }`} onClick={()=>handleRoleChange("instructor")}>
                  Instructor
                </button>
              </div>
            </div>
            </CardContent>
            <CardContent>
              <div className="w-[100%] flex items-center gap-2 mb-2">
                <div className="w-[35%] h-[0.5px] bg-[#c4c4c4]"></div>
                <div className="w-[30%] text-[15px] text-[#6f6f6f] flex items-center justify-center">Or continue</div>
                <div className="w-[35%] h-[0.5px] bg-[#c4c4c4]"></div>
              </div>
              <button
                type="button"
                disabled={!isGoogleAuthAvailable}
                className="h-[40px] w-full border-[2px] border-black rounded-[5px] flex justify-center items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#c4c4c4]"
                onClick={googleSignUp}
              >
                <img src={Goomgle} className="w-[25px]"/>
                <span className="text-[18px] text-gray-500 font-semibold">oogle</span>

              </button>

            </CardContent>
            <CardFooter>
              <Button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. abc@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword? "":"password"}
                    name="password"
                    value={loginInput.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Eg. xyz@12"
                    required
                  />
                  <button type="button" onClick={()=>isShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white">
                    {showPassword? <FiEye/>:<FiEyeOff/>}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardContent>
              <div className="w-[100%] flex items-center gap-2 mb-2">
                <div className="w-[35%] h-[0.5px] bg-[#c4c4c4]"></div>
                <div className="w-[30%] text-[15px] text-[#6f6f6f] flex items-center justify-center">Or continue</div>
                <div className="w-[35%] h-[0.5px] bg-[#c4c4c4]"></div>
              </div>
              <button
                type="button"
                disabled={!isGoogleAuthAvailable}
                className="h-[40px] w-full border-[2px] border-black rounded-[5px] flex justify-center items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#c4c4c4]"
                onClick={googleLogin}
              >
                <img src={Goomgle} className="w-[25px]"/>
                <span className="text-[18px] text-gray-500 font-semibold">oogle</span>

              </button>

            </CardContent>
            <CardFooter>
              <Button
                disabled={loginIsLoading}
                onClick={() => handleRegistration("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Login;
