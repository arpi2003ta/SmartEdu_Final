import { Menu, MessageSquare, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import IconNavbar from "./IconNavbar";
import Chat from "@/components/Chat";
import { useState } from "react";
import { STUDENT_NAV_ITEMS } from "@/constants/navigation";
import LanguageSwitcher, { LanguageTranslator } from "./LanguageSwitcher";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await logoutUser();
  };

  const handleCbtClick = () => {
    if (user?.role == "instructor") {
      navigate("/admin/CBT/manage");
    } else {
      navigate("/cbt");
    }
  };
  const handleAIEXaminerClick = () => {
    if (user?.role == "instructor") {
      navigate("/admin/ai-examiner/instructor");
    } else {
      navigate("/ai-examiner");
    }
  };

  const handlePersonalizedRoadmapClick = () => {
    if (user?.role == "student") {
      navigate("/ai-roadmap");
    }
  };

  const handleCollegePredictorClick = () => {
    if (user?.role == "student") {
      navigate("/college-predictor");
    }
  };

  /*const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
    } catch (error) {
      toast.error("Logout failed.");
    }
  };*/

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const enrolledCourses = user?.enrolledCourses || [];
  const editProfilePath =
    user?.role === "instructor" ? "/admin/profile/edit" : "/profile";

  return (
    <>
      <LanguageTranslator />
      <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-50">
        {/* Desktop */}
        <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
          <div className="flex items-center gap-2">
            <School size={"30"} />
            <h1
              onClick={() =>
                navigate(user?.role === "instructor" ? "/admin/dashboard" : "/")
              }
              className="hidden md:block font-extrabold text-2xl cursor-pointer"
            >
              SmartEdu
            </h1>
          </div>

          {/* Centered Navigation for Students */}
          <div className="flex-1 flex justify-center">
            <IconNavbar
              items={STUDENT_NAV_ITEMS.filter((item) =>
                user?.role === "instructor"
                  ? item.role === "instructor"
                  : !item.role,
              )}
              canChat={enrolledCourses.length > 0}
              onOpenChat={() => setIsChatOpen(true)}
            />
            {user?.role === "instructor" && (
              <Chat
                triggerButton={
                  <button className="flex items-center gap-2">
                    <MessageSquare size={22} />
                  </button>
                }
              />
            )}
          </div>

          {/* User icons and dark mode icon  */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {/*<DropdownMenuItem>
                    <Link to="my-learning">My learning</Link>
                  </DropdownMenuItem>*/}
                    {user?.role === "student" && (
                      <DropdownMenuItem>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {user?.role !== "instructor" && (
                      <DropdownMenuItem>
                        <Link to="my-learning">My learning</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      {" "}
                      <Link to={editProfilePath}>Edit Profile</Link>{" "}
                    </DropdownMenuItem>
                    {user?.role === "instructor" ? (
                      <DropdownMenuItem onClick={handleCbtClick}>
                        {" "}
                        CBT Manage
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={handleCbtClick}>
                        {" "}
                        CBT Practice
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleAIEXaminerClick}>
                      {" "}
                      AI Examiner
                    </DropdownMenuItem>
                    {user?.role === "student" && (
                      <>
                        <DropdownMenuItem
                          onClick={handlePersonalizedRoadmapClick}
                        >
                          {" "}
                          Personalized Roadmap
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCollegePredictorClick}>
                          {" "}
                          College Predictor
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={logoutHandler}>
                      Log out
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                  {" "}
                  <Link to="ai-examiner">AI Examiner</Link>{" "}
                  </DropdownMenuItem> */}
                  </DropdownMenuGroup>
                  {user?.role === "instructor" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to="/admin/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/login")}>Signup</Button>
              </div>
            )}
            <DarkMode />
          </div>
        </div>
        {/* Mobile device  */}
        <div className="flex md:hidden items-center justify-between px-4 h-full">
          {/*<h1 className="font-extrabold text-2xl">SmartEdu</h1>*/}
          <h1
            onClick={() =>
              user?.role === "instructor"
                ? navigate("/admin/dashboard")
                : user?.role === "student"
                  ? navigate("/dashboard")
                  : navigate("/")
            }
            className="font-extrabold text-2xl cursor-pointer"
          >
            SmartEdu
          </h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <MobileNavbar user={user} logoutHandler={logoutHandler} />
          </div>
        </div>
      </div>

      <Chat open={isChatOpen} onOpenChange={setIsChatOpen} hideTrigger />
    </>
  );
};

export default Navbar;

const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();
  const editProfilePath =
    user?.role === "instructor" ? "/admin/profile/edit" : "/profile";
  const handleMobileAIExaminerClick = () => {
    navigate(
      user?.role === "instructor"
        ? "/admin/ai-examiner/instructor"
        : "/ai-examiner",
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          {/*<SheetTitle> <Link to="/">SmartEdu</Link></SheetTitle>*/}
          <SheetTitle
            onClick={() =>
              user?.role === "instructor"
                ? navigate("/admin/dashboard")
                : navigate("/")
            }
            className="cursor-pointer"
          >
            SmartEdu
          </SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          <Link to="/">Home</Link>
          {user?.role === "student" && <Link to="/dashboard">Dashboard</Link>}
          {user?.role !== "instructor" && (
            <Link to="/my-learning">My Learning</Link>
          )}
          <Link to={editProfilePath}>Edit Profile</Link>
          <button
            type="button"
            onClick={handleMobileAIExaminerClick}
            className="text-left"
          >
            AI Examiner
          </button>
          <Link to="/course/search">AI Search</Link>
          {/*<p>Log out</p>*/}
          <button onClick={logoutHandler} className="text-left text-white-600 ">
            Log out
          </button>
        </nav>
        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="submit"
                onClick={() => navigate("/admin/dashboard")}
              >
                Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
