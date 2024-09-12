import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure} from '@nextui-org/react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function DashUser() {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState([]);
  const { isOpen, onOpen, onClose,onOpenChange } = useDisclosure();
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/user/get-user`);
        const result = await res.json();
        setUser(result.result);
      } catch (error) {
        console.log(error);
      }
      setLoading(false)
    };
    fetchPost();
  }, [currentUser._id]);
  const openDeleteModal = (userId) => {
    setDeleteUserId(userId);
    onOpen();
  };
  const handleDeleteUser = async (e) => {
    try{
      const res = await fetch(`/api/auth/delete-user/${deleteUserId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) {
        console.log('Failed to delete the user!!!');
      }
      if (res.ok) {
        setUser((prev) => prev.filter((user1) => user1._id !== deleteUserId));
      }
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  if (loading) {
    return (
      <div className="w-full h-full p-3 flex justify-center items-center">
        <Spinner color="primary" labelColor="primary" />
      </div>
    );
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
                        onPress={() => openDeleteModal(user._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <p>No users yet!</p>
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
                    <p>Are you sure you want to delete the user?</p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleDeleteUser}
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
  );
}
