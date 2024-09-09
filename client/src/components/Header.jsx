import React, { useRef, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Avatar as Avatar1,
  Button,
  Divider,
} from "@nextui-org/react";
import {
  Dropdown as Dropdown1,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const ref = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const menuItems = [{ name: "Dashboard", href: "/dashboard?tab=profile" }];

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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar maxWidth="2xl" onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent className="max-w-[80%]">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand justify="start">
            <p className="font-bold text-inherit text-xl">ALESTER</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-14" justify="center">
          <NavbarItem className={isActive("/") ? "active" : ""}>
            <Link
              to="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={"text-black"}
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem className={isActive("/project") ? "active" : ""}>
            <Link
              to="/project"
              aria-current={isActive("/project") ? "page" : undefined}
              className={"text-black"}
            >
              Projects
            </Link>
          </NavbarItem>
          <NavbarItem className={isActive("/post") ? "active" : ""}>
            <Link
              to="/post"
              aria-current={isActive("/post") ? "page" : undefined}
              className={"text-black"}
            >
              Blogs
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          {currentUser ? (
            <Dropdown1 placement="bottom-end">
              <DropdownTrigger>
                <Avatar1
                  isBordered
                  as="button"
                  className="transition-transform"
                  src={currentUser.profilePicture}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{currentUser.email}</p>
                </DropdownItem>
                <DropdownItem key="dashboard">
                  <Link to="/dashboard?tab=profile">Dashboard</Link>
                </DropdownItem>
                {/* <Divider/> */}
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  onPress={onOpen}
                >
                  Sign out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown1>
          ) : (
            <Link to="/sign-in">
              <Button
                as="div"
                className="h-10 border-default-400"
                onPress={(e) => {
                  e.preventDefault();
                }}
                variant="bordered"
              >
                Sign in
              </Button>
            </Link>
          )}
        </NavbarContent>

        {currentUser && <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index == 1
                    ? "primary"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                className="w-full"
                to={`${item.href}`}
                size="lg"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem key={`2`}>
            <Link color={"danger"} className="w-full" size="lg">
              Log out
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>}
      </Navbar>
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
                <Button color="danger" onPress={() => closeModal(true)}>
                  Log out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
