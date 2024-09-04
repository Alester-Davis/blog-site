import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, Router } from "react-router-dom";
export default function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPost, setUserPost] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletePostId, setDeletePostID] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/get-post?userId=${currentUser._id}`);
        const result = await res.json();
        setUserPost(result.result);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchPost();
  }, [currentUser._id]);

  const handleDeletePost = async () => {
    try {
      const res = await fetch(
        `/api/post/delete-post/${deletePostId}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        console.log("Failed to delete the post!!!");
      }
      if (res.ok) {
        setUserPost((prev) => prev.filter((post) => post._id !== deletePostId));
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };


  if (loading) {
    return (
      <div className="w-full h-full p-3 flex justify-center items-center">
        <Spinner color="primary" labelColor="primary" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full p-4  flex justify-center items-center">
        <div className="w-3/4">
          {currentUser.role === "admin" && (
            <Link to="/dashboard?tab=create-post">
              <Button as="div" variant="bordered" className="flex items-center justify-center" onPress={(e)=>{e.preventDefault()}}>Create post</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="w-full p-3 flex justify-center">
        {currentUser.role === "admin" && userPost.length > 0 ? (
          <>
            <Table aria-label="User Table" className="w-3/4" bordered>
              <TableHeader>
                <TableColumn>Date Updated</TableColumn>
                <TableColumn>Post Image</TableColumn>
                <TableColumn>Post Title</TableColumn>
                <TableColumn>Category</TableColumn>
                <TableColumn className="pl-8">Actions</TableColumn>
                <TableColumn>Edit</TableColumn>
              </TableHeader>
              <TableBody>
                {userPost.map((post, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          className="w-20 h-10 object-contain"
                          alt={post.title}
                        />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/post/${post.slug}`} color="foreground">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/post/${post.slug}`} color="foreground">
                        {post.category}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        auto
                        flat
                        className="text-danger bg-transparent"
                        onClick={() => {
                          setDeletePostID(post._id);
                          onOpen();
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Link href={`/update-post/${post._id}`}>
                        <span className="font-medium text-amber-300 hover:none cursor-pointer">
                          Edit
                        </span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <p>No posts yet!</p>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirm Deletion
                </ModalHeader>
                <ModalBody>
                  <div className="text-center">
                    <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
                    <p>Are you sure you want to delete this post?</p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleDeletePost}
                  >
                    Yes, I'm sure
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    No, cancel
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
