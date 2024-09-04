import { Alert, Modal } from "flowbite-react";
import { Button, Textarea } from "@nextui-org/react";
import Comment from "./Comment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState({
    type: false,
    content: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setCommentToDelete] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (comment.length === 0) {
      setCommentError({ type: true, content: "Content is required!" });
      return;
    }
    if (comment.length > 200) {
      return;
    }
    try {
      const result = await fetch(`/api/comment/createComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const res = await result.json();
      if (result.ok) {
        setComment("");
        setCommentError({ type: false, content: "" });
        setComments([res, ...comments]);
      }
    } catch (error) {
      setCommentError({ type: true, content: error.message });
    }
  };

  useEffect(() => {
    const fetchComment = async () => {
      const res = await fetch(`/api/comment/getPostComments/${postId}`);
      const result = await res.json();
      if (res.ok) {
        setComments(result);
      }
    };
    fetchComment();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      const result = await res.json();
      if (res.ok) {
        setComments((prev) => {
          return prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: result.likes,
                  noOfLikes: result.likes.length,
                }
              : comment
          );
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {};

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `/api/comment/deletePostComment/${deleteId}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setShowModal(false);
        setComments((prev) =>
          prev.filter((comment) => comment._id !== deleteId)
        );
        setCommentToDelete(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as :</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt="profile"
          />
          <Link to="/dashboard?tab=profile">@{currentUser.username}</Link>
        </div>
      ) : (
        <div>
          <p className="text-sm text-teal-500 my-5 flex gap-1">
            You are not logged in
          </p>
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-slate-500 rounded-md p-3"
        >
          <Textarea
            isInvalid={commentError.type}
            variant="bordered"
            placeholder="Enter your comment"
            className="col-span-12 md:col-span-6 mb-6 md:mb-0 outline-none bg-transparent border-none focus:border-none"
            errorMessage={commentError.type ? commentError.content : ""}
            onChange={(e) =>{
              setComment(e.target.value)
              setCommentError({...commentError,type:false})
            }}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button variant="bordered"  className="border-1 border-black" type="submit">
              Submit
            </Button>
          </div>
          {comments.length === 0 ? (
            <p className="text-sm">No comments found</p>
          ) : (
            <>
              <div className="flex space-x-3">
                <p>Comments</p>
                <div className="flex justify-center items-center">
                  <p className="text-sm">{comments.length}</p>
                </div>
              </div>
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }}
                />
              ))}
            </>
          )}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this comment?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="failure"
                    onClick={() => handleDelete(deleteId)}
                  >
                    Yes, I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </form>
      )}
    </div>
  );
}
