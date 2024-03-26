import { Button, Modal, Table} from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function DashUser() {
  const {currentUser} = useSelector((state)=>state.user)
  const [user,setUser] = useState([])
  const [showMore,setShowMore] = useState(true)
  const [showModal,setShowModal] = useState(false)
  const [deletUserId,setDeleteUserID] = useState(null)
  useEffect(()=>{
    const fetchPost = async()=>{
      try{
        const res = await fetch(`/api/user/get-user`)
        const result = await res.json()
        console.log(result)
        setUser(result.result)
        if(result.result.length < 9){
          setShowMore(false)
        }
      }
      catch(error){
        console.log(error)
      }
    }
    fetchPost()
  },[currentUser._id])
  const handleDeletePost = async(e)=>{
    e.preventDefault();
    try{
      const res = await fetch(`/api/auth/delete-user/${deletUserId}`,{
        method : "DELETE"
      })
      const result = await res.json()
      if(!res.ok){
        console.log("Failed to delete the post!!!")
      }
      if(res.ok){
        setUser((prev)=> prev.filter((user1)=> user1._id != deletUserId))
        setShowModal(false)
        if(user.length < 9){
          setShowMore(false)
        }
      }
    }
    catch(error){
      console.log(error)
    }
  }
  const showMoreHanlde = async()=>{
    try{
      const res = await fetch(`/api/user/get-user?startIndex=${user.length}`)
      const result = await res.json()
      if (res.ok) {
        setUser((prev) => [...prev, ...result.result]);
        if (result.result.length < 9) {
          setShowMore(false);
        }
      }
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <div className='table-auto overflow-x md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {currentUser.role === "admin" && user.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>User Mail</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {user.map((user,index)=>(
              <Table.Body key={index} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <img src={user.profilePicture} className='w-20 h-10 object-contain'/>
                      </Table.Cell>
                      <Table.Cell>
                        {user.email}
                      </Table.Cell>
                      <Table.Cell>
                        {user.role}
                      </Table.Cell>
                      <Table.Cell>
                        {user.role==="admin"?(<span></span>):(<span onClick={()=>{
                          setShowModal(true) 
                          setDeleteUserID(user._id)
                        }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>)}

                      </Table.Cell>
                  </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={showMoreHanlde}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (<p>You have no post yet!</p>)}
      <Modal
        show={showModal}
        onClose={() =>{
          setShowModal(false)
        }}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete the user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
