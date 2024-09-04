import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table';
import { Button, Modal, Spinner} from '@nextui-org/react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function DashUser() {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/user/get-user`);
        const result = await res.json();
        setUser(result.result);
        if (result.result.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false)
    };
    fetchPost();
  }, [currentUser._id]);

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/delete-user/${deleteUserId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) {
        console.log('Failed to delete the user!!!');
      }
      if (res.ok) {
        setUser((prev) => prev.filter((user1) => user1._id !== deleteUserId));
        setShowModal(false);
        if (user.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showMoreHandle = async () => {
    try {
      const res = await fetch(`/api/user/get-user?startIndex=${user.length}`);
      const result = await res.json();
      if (res.ok) {
        setUser((prev) => [...prev, ...result.result]);
        if (result.result.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  if(loading){
    return(
      <div className='w-full p-3 flex justify-center'>
         <Spinner color="primary" labelColor="primary"/>
      </div>
    )
  }
  return (
    <div className='w-full p-3 flex justify-center'>
      {currentUser.role === 'admin' && user.length > 0 ? (
        <>
          <Table aria-label="User Table" className='w-3/4' bordered>
            <TableHeader>
              <TableColumn className=''>Date Created</TableColumn>
              <TableColumn className=''>User Image</TableColumn>
              <TableColumn className=''>User Email</TableColumn>
              <TableColumn className=''>Role</TableColumn>
              <TableColumn className='pl-8'>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {user.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <img
                      src={user.profilePicture}
                      alt={user.email}
                      className='w-11 h-11 rounded-full objext-contain'
                    />
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.role === 'admin' ? (
                      <span></span>
                    ) : (
                      <Button
                        auto
                        flat
                        className='text-danger bg-transparent'
                        onClick={() => {
                          setShowModal(true);
                          setDeleteUserId(user._id);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {showMore && (
            <Button
              auto
              flat
              color='primary'
              onClick={showMoreHandle}
              css={{ marginTop: '20px', width: '100%' }}
            >
              Show More
            </Button>
          )}
        </>
      ) : (
        <p>No users yet!</p>
      )}
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        {/* <Modal.Header>
          <Text id="modal-title" size={18}>
            Confirm Deletion
          </Text>
        </Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 mb-4 mx-auto' />
            <Text>Are you sure you want to delete the user?</Text>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color='error' onClick={handleDeleteUser}>
            Yes, I'm sure
          </Button>
          <Button auto flat color='secondary' onClick={() => setShowModal(false)}>
            No, cancel
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}
