import {
  Button,
  Input,
  Spinner,
  Modal,
  Progress,
  CircularProgress,
  ModalFooter,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStorage } from "firebase/storage";
import { app } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function DashProfile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileProgress, setImageFileProgress] = useState(null);
  const [imageFileError, setImageFileError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [success, setSuccess] = useState(null);
  const imagePicker = useRef();
  console.log(imageFileProgress, imageFileError);
    useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        profilePicture: currentUser.profilePicture,
      });
    }
  }, []);
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + imageFile.name;
    const storeRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storeRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileError(
          "Could not upload image [File size should be less than 2MB]"
        );
        setImageFileUrl(null);
        setImageFileProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setImageFileUrl(downloadURL);
          setFormData((prev) => {
            return { ...prev, profilePicture: downloadURL };
          });
          setImageFileError(null);
        });
      }
    );
  };

  const clickHandle = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      console.log("hello");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/auth/update-user/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const resData = await res.json();
      console.log(resData._doc);
      if (!res.ok) {
        toast.error("Error")
        toast((t) => (
            <span className="flex flex-col">
              <b>{resData.message}</b>
              <Button variant="bordered" onClick={() => toast.dismiss(t.id)}>
                Dismiss 
              </Button>
            </span>
          ));
        return dispatch(updateFailure(resData.message));
      }
      dispatch(updateSuccess(resData._doc));
      setImageFileProgress(null);
      setSuccess("Updated successfully..");
      toast.success("Updated successfully")
    } catch (error) {
      console.log(error);
      dispatch(updateFailure(error));
    }
  };

  const changeHandle = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  return (
    <div className="max-w-lg mx-auto w-full mb-32 p-7">
      <div
        className="overflow-y-auto max-h-screen"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4 mb-20">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={imagePicker}
            hidden
          />
          <div
            className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full stroke-"
            onClick={() => imagePicker.current.click()}
          >
            {imageFileProgress && (
              <CircularProgress
                value={imageFileProgress || 0}
                // label={`${imageFileProgress}%`}
                color="primary"
                classNames={{
                    svg: "w-full h-full drop-shadow-md",
                    indicator: "stroke-blue-500",
                    track: "stroke-white",
                    value: "text-3xl font-semibold text-white",
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt="User"
              className="rounded-full w-full h-full object-cover border-8 border-{lightgray}"
            />
          </div>
          <Input
            type="text"
            value={formData.username}
            variant="bordered"
            id="username"
            onChange={changeHandle}
            placeholder="Username"
          />
          <Input
            type="email"
            value={formData.email}
            variant="bordered"
            id="email"
            onChange={changeHandle}
            placeholder="Email"
          />
          <Button onClick={clickHandle} disabled={loading} variant="bordered" className="border-2 border-black text-white font-bold bg-slate-800">
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Updating...</span>
              </>
            ) : (
              "Update profile"
            )}
          </Button>
          {success && (
            <Modal
              color="success"
              open={!!success}
              onClose={() => setSuccess(null)}
            >
              {success}
            </Modal>
          )}
        </form>

        {/* <form className="flex flex-col gap-4 mb-12">
          <Input type="password" placeholder="Current Password" />
          <Input type="password" placeholder="New Password" />
          <Input type="password" placeholder="ReType New Password" />
          <Button variant="bordered" className="border-2 border-black text-white font-bold  bg-black">Update Password</Button>
        </form> */}
        <form className="flex flex-col gap-4">
          <p className="text-sm">Do you want to delete your account ?</p>
          <Button variant="bordered" className="border-2 border-red-500 text-red-500 font-bold">Delete Account</Button>
        </form>
      </div>
      <div><Toaster position="bottom-right"/></div>

    </div>
  );
}
