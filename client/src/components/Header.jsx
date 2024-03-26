import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import {Modal } from 'flowbite-react';
import { Link , useLocation, useNavigate} from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon, FaSun} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { useState } from 'react';
import { signoutSuccess } from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
export default function Header() {
    const dispatch = useDispatch()
    const path = useLocation().pathname
    const {theme} = useSelector(state=>state.theme)
    const {currentUser} = useSelector(state=>state.user)
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate()
    const closeModal = async (accept) => {
        if (accept === true) {
            const res = await fetch("/api/auth/sign-out");
            const resData = await res.json();
            console.log(resData)
            if (res.ok) {
                dispatch(signoutSuccess());
                navigate("/sign-in");
            }
        }
        setOpenModal(false);
    };
    
  return (
    <Navbar className='border-b-2'>
        <Link to="/" className='self-center whitesapce-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Alester's</span>Blog
        </Link>
        <form>
            <TextInput type='text' className='hidden lg:inline' rightIcon={AiOutlineSearch} placeholder='search..'></TextInput>
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch/>
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-10' color='grey'onClick={()=> dispatch(toggleTheme())}>
                {theme === "light" ?<FaMoon/> : <FaSun/>}
            </Button>
            {currentUser ? (
                <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={currentUser.profilePicture} rounded></Avatar>}>
                    <Dropdown.Header className='flex flex-col'>
                        <span className='text-sm'>@{currentUser.username}</span>
                        <span className='text-sm font-medium truncate'>{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to="/dashboard?tab=profile">
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider/>
                    <Dropdown.Item onClick={()=>setOpenModal(true)} as='div'>Sign out</Dropdown.Item>
                </Dropdown>) : (
                <Link to="/sign-in">
                    <Button className='h-10' gradientDuoTone="purpleToBlue" outline>Sign in</Button>
                </Link>
            )}
            <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path === "/"} as={"div"}>
                <Link to="/">Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/project"} as={"div"}>
                <Link to="/project">Projects</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as={"div"}>
                <Link to="/about">About</Link>
            </Navbar.Link>
        </Navbar.Collapse>
        <Modal
            show={openModal}
            onClose={() =>{
                setOpenModal(false)
            }}
            popup
            size='md'
        >
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Are you sure you want to sign out?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={()=>closeModal(true)}>
                  Yes, I'm sure
                </Button>
                <Button color='gray' onClick={() => setOpenModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
    </Navbar>
  )
}
