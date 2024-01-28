import { Alert, Button, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import {getStorage} from "firebase/storage"
import { app } from "../../firebase"
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function DashProfile() {
  const {currentUser} = useSelector(state=>state.user)
  const [imageFile,setImageFile] = useState(null)
  const [imageFileProgress,setImageFileProgress] = useState(null)
  const [imageFileError,setImageFileError] = useState(null)
  const [imageFileUrl,setImageFileUrl] =useState(null)
  const imagePicker = useRef()
  console.log(imageFileProgress,imageFileError)
  const handleImageChange = (e)=>{
    console.log(e.target.files[0])
    setImageFile(e.target.files[0])
    // setImageFileUrl(URL.createObjectURL(e.target.files[0]))
  }
  useEffect(()=>{
    if(imageFile)
        uploadImage()
  },[imageFile])

  const uploadImage = async()=>{
    const storage = getStorage(app)
    const filename = new Date().getTime() + imageFile.name
    const storeRef = ref(storage,filename)
    const uploadTask = uploadBytesResumable(storeRef,imageFile)
    uploadTask.on(
        'state_changed',
        (snapshot)=>{
            const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
            setImageFileProgress(progress.toFixed(0))
        },
        (error)=>{
            setImageFileError("Could not upload image [File size should be less than 2MB] ")
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                setImageFileUrl(downloadURL)
            })
        }
    )
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full mb-32">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4 mb-20">
            <input type="file" accept="image/*" onChange={handleImageChange} ref={imagePicker} hidden/>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>imagePicker.current.click()}> 
                {imageFileProgress && <CircularProgressbar
                    value={imageFileProgress||0} text={`${imageFileProgress}%`}
                    styles={{
                        root:{
                            width:'100%',
                            height:'100%',
                            position:'absolute',
                            top:0,
                            left:0
                        },
                        path:{
                            stroke:`rgba(62,152,199,${imageFileProgress/100})`
                        }
                    }}
                />}
                <img src={imageFileUrl || currentUser.profilePicture} alt="User" className="rounded-full w-full h-full object-cover border-8 border-{lightgray}"/>
            </div>
            {imageFileError && <Alert color={"failure"}>{imageFileError}</Alert>}
            <TextInput type="text" defaultValue={currentUser.username}/>
            <TextInput type="email" defaultValue={currentUser.email}/>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>Update Profile</Button>
        </form>
        <form className="flex flex-col gap-4 mb-12">
            <TextInput type="password" placeholder="Current Password"/> 
            <TextInput type="password" placeholder="New Password"/>
            <TextInput type="password" placeholder="ReType New Password"/>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>Update Password</Button>
        </form>
        <form className="flex flex-col gap-4">
            <p className="text-sm">Do you want to delete your account ?</p>
            <Button type="submit" gradientDuoTone="pinkToOrange" outline>Delete Account</Button>
        </form>
    </div>
  )
}
