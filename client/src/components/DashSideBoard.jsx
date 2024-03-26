import { Button, Modal, Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {HiArrowRight, HiOutlineExclamationCircle, HiUser} from 'react-icons/hi'
import { FaRegNewspaper , FaUsers} from 'react-icons/fa'
import { MdWarning } from 'react-icons/md';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
export default function DashSideBoard() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [tab,setTab] = useState('')
  const [openModal,setOpenModal] = useState(false)
  const {currentUser } = useSelector((state)=>state.user)
  const closeModal = async(event,accept)=>{
    event.preventDefault()
    if(accept === true){
      const res = await fetch("/api/auth/sign-out")
      const resData = await res.json()
      if(res.ok){
        dispatch(signoutSuccess())
        navigate("/sign-in")
      }
    }
    setOpenModal(false)
  }
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tab = urlParams.get("tab")
    if(tab){
      setTab(tab)
    }
  },[location.search])
  return (
    <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to="/dashboard?tab=profile">
                <Sidebar.Item active={tab==="profile"} icon={HiUser} label={currentUser.role} labelColor='dark'>Profile</Sidebar.Item>
                </Link>
                {currentUser.role === "admin" && 
                  <Link to="/dashboard?tab=post">
                      <Sidebar.Item active={tab==="post"} icon={FaRegNewspaper} labelColor='dark'>Post</Sidebar.Item>
                  </Link>
                }
                {currentUser.role === "admin" && 
                  <Link to="/dashboard?tab=user">
                      <Sidebar.Item active={tab==="user"} icon={ FaUsers} labelColor='dark'>Users</Sidebar.Item>
                  </Link>
                }
                <Sidebar.Item icon={HiArrowRight} className="cursor-pointer" onClick={()=>setOpenModal(true)}>Sign Out</Sidebar.Item>
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
                        <Button color='failure' onClick={(event)=>closeModal(event,true)}>
                          Yes, I'm sure
                        </Button>
                        <Button color='gray' onClick={() => setOpenModal(false)}>
                          No, cancel
                        </Button>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
