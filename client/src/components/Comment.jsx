import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button , Textarea} from '@nextui-org/react';
import { set } from 'mongoose';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getUser = async () => {
      try {
        console.log(comment.userId)
        const res = await fetch(`/api/user/get-user?userId=${comment.userId}`);
        const data = await res.json();
        console.log(data.result[0])
        if (res.ok) {
          setUser(data.result[0]);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, []);
  useEffect(()=>{
    console.log(editedContent)
  },[editedContent])

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(editedContent);
  };

  const handleSave = async (e) => {
    console.log(editedContent)
    e.preventDefault()
    if(editedContent==="") return;
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}/${comment.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
          createdAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='flex p-7 border-b dark:border-gray-600 text-sm pl-2'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture || `data:image/png;base64,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`}
          alt={user.username || "Deleted User"}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
            isInvalid={editedContent===""}
            variant="bordered"
            placeholder="Enter your comment"
            className="col-span-12 md:col-span-6 mb-6 md:mb-0 outline-none bg-transparent"
            errorMessage={"Comment can't be empty!"}
            value={editedContent}
            onChange={(e) =>{
              setEditedContent(e.target.value)
            }}
            ></Textarea>
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                variant='bordered'
                className='border-1 border-black'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className='text-gray-500 pb-2'>{editedContent}</p>
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              {/* <p>{JSON.stringify(comment.likes.includes(currentUser._id))}</p> */}
              <button
                type='button'
                onClick={() => onLike(comment._id)}
                className={` hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <FaThumbsUp className='text-sm'  />
              </button>
              <p className='text-gray-400'>
                {comment.noOfLikes > 0 &&
                  comment.noOfLikes +
                    ' ' +
                    (comment.noOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='text-gray-400 hover:text-blue-500'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)}
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}