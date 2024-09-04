import {
  Avatar,
  Badge,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FiAlignJustify } from "react-icons/fi";
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineExclamationCircle,
  HiUser,
} from "react-icons/hi";
import { FaSignOutAlt } from "react-icons/fa";
import { FaRegNewspaper, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { IoMdClose } from "react-icons/io";
import { current } from "@reduxjs/toolkit";
import { NotificationIcon } from "./Notification";
export default function DashSideBoard() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const closeModal = async (accept) => {
    if (accept === true) {
      const res = await fetch("/api/auth/sign-out");
      const resData = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    }
    onOpenChange(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get("tab");
    if (tab) {
      setTab(tab);
    }
  }, [location.search]);

  return (
    <div>
      <div className="flex justify-end items-center w-[100vw] px-2 border-b-1 md:hidden shadow-sm space-x-4">
        <Badge color="danger" content={5} shape="circle">
          <NotificationIcon className="fill-current" size={30} />
        </Badge>
        <Avatar
          isBordered
          size="sm"
          className="transition-transform mb-1"
          src={currentUser.profilePicture}
        />
        <div className="md:hidden flex justify-center py-4">
          <div
            onClick={() => setIsSidebarOpen(true)}
            className="cursor-pointer"
          >
            <FiAlignJustify size={24} />
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-y-0 shadow-md left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out bg-white w-[300px] md:w-[300px] z-50 h-[100vh]`}
      >
        <div className="flex justify-between p-4 md:hidden">
          <div onClick={() => setIsSidebarOpen(false)}>
            <IoMdClose size="25px" />
          </div>
        </div>
        <div className="p-4 h-[98vh] w-full">
          <div className="h-1/6 flex justify-center pt-7">
            <h1 className="text-2xl font-bold">ALESTER</h1>
          </div>
          <Divider className="my-4" />
          <div className="flex flex-col h-2/4">
            <Link to="/dashboard?tab=profile">
              <div
                className={`p-2 my-2 rounded-lg ${
                  tab === "profile" ? "bg-gray-200" : ""
                } flex items-center`}
              >
                <HiUser className="mr-2" />
                <span>Profile</span>
              </div>
            </Link>
            {currentUser.role === "admin" && (
              <>
                <Link to="/dashboard?tab=post">
                  <div
                    className={`p-2 my-2 rounded-lg ${
                      tab === "post" || tab == "create-post"
                        ? "bg-gray-200"
                        : ""
                    } flex items-center`}
                  >
                    <FaRegNewspaper className="mr-2" />
                    <span>Post</span>
                  </div>
                </Link>
                <Link to="/dashboard?tab=user">
                  <div
                    className={`p-2 my-2 rounded-lg ${
                      tab === "user" ? "bg-gray-200" : ""
                    } flex items-center`}
                  >
                    <FaUsers className="mr-2" />
                    <span>Users</span>
                  </div>
                </Link>
                <Divider className="my-6" />
              </>
            )}
          </div>
          <div className="">
            <div className="flex space-x-4">
              <Avatar
                isBordered
                as="button"
                size="lg"
                className="transition-transform mt-1"
                src={currentUser.profilePicture}
              />
              <div className="flex flex-col space-y-1">
                <p className="font-semibold text-md">{currentUser.email}</p>
                <div className="w-16 h-7 border-2 border-slate-600 flex items-center justify-center rounded-md bg-slate-600 text-white text-sm">
                  <p>{currentUser.role}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-5 mt-2">
              <Link>
                <div
                  className="p-2 my-2 rounded-lg flex items-center justify-center cursor-pointer text-slate-700 border-1 border-slate-700 w-28 hover:text-red-500 hover:border-red-500"
                  onClick={() => onOpenChange(true)}
                >
                  <FaSignOutAlt className="mr-2" />
                  <span>Sign Out</span>
                </div>
              </Link>
              <Link to="/">
                <div className="p-2 my-2 rounded-lg flex items-center justify-center cursor-pointer text-slate-700 border-1 border-slate-700 w-28 hover:text-blue-500 hover:border-blue-500">
                  <HiArrowLeft className="mr-2" />
                  <span>Back</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Logout
              </ModalHeader>
              <ModalBody>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
                  <p>Are you sure you want to log out?</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button color="danger" onClick={() => closeModal(true)}>
                  Log out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
