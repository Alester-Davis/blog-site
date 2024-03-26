import { Button, Modal, Table} from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function DashPost() {
  const {currentUser} = useSelector((state)=>state.user)
  const [userPost,setUserPost] = useState([])
  const [showMore,setShowMore] = useState(true)
  const [showModal,setShowModal] = useState(false)
  const [deletPostId,setDeletePostID] = useState(null)
  useEffect(()=>{
    const fetchPost = async()=>{
      try{
        const res = await fetch(`/api/post/get-post?userId=${currentUser._id}`)
        const result = await res.json()
        console.log(result)
        setUserPost(result.result)
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
      const res = await fetch(`/api/post/delete-post/${deletPostId}/${currentUser._id}`,{
        method : "DELETE"
      })
      const result = await res.json()
      if(!res.ok){
        console.log("Failed to delete the post!!!")
      }
      if(res.ok){
        setUserPost((prev)=> prev.filter((post)=> post._id != deletPostId))
        setShowModal(false)
        if(userPost.length < 9){
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
      const res = await fetch(`/api/post/get-post?startIndex=${userPost.length}`)
      const result = await res.json()
      if (res.ok) {
        setUserPost((prev) => [...prev, ...result.result]);
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
      {currentUser.role === "admin" && userPost.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                    <span>Edit</span>
                </Table.HeadCell>
            </Table.Head>
            {userPost.map((post,index)=>(
              <Table.Body key={index} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <img src={post.image} className='w-20 h-10 object-contain'/>
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          {post.category}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <span onClick={()=>{
                          setShowModal(true) 
                          setDeletePostID(post._id)
                        }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/update-post/${post._id}`}>
                          <span className='font-medium text-amber-300 hover:underline cursor-pointer'>Edit</span>
                        </Link>
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
              Are you sure you want to delete this post?
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
