import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBoard from "../components/DashSideBoard";
import DashProfile from "../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUser from "../components/DashUser";
import CreatePost from "./CreatePost";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "@nextui-org/react";
import { NotificationIcon } from "../components/Notification";
import UpdatePost from "./UpdatePost";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get("tab");
    if (tab) {
      setTab(tab);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-[300px]">
        <DashSideBoard />
      </div>
      <div className="w-[100vw]">
        <div className="hidden md:flex items-center justify-end p-4 h-[50px] w-full sticky top-2 bg-white shadow-sm z-20 mb-10 space-x-5">
          <Badge color="danger" content={5} shape="circle">
            <NotificationIcon className="fill-current" size={30} />
          </Badge>
          <Avatar
            isBordered
            size="sm"
            className="transition-transform mb-1"
            src={currentUser.profilePicture}
          />
        </div>
        {tab === "profile" && <DashProfile />}
        {tab === "post" && <DashPost />}
        {tab === "user" && <DashUser />}
        {tab === "create-post" && <CreatePost />}
        {tab === "update-post" && <UpdatePost/>}
      </div>
    </div>
  );
}
