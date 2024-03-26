import { Alert, Button, Spinner, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {getStorage} from "firebase/storage"
import { app } from "../../firebase"
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice"
import { Link } from "react-router-dom"

export default function DashProfile() {
  const {currentUser,loading,error} = useSelector(state=>state.user)
  const dispatch = useDispatch()
  const [formData,setFormData] = useState({})
  const [imageFile,setImageFile] = useState(null)
  const [imageFileProgress,setImageFileProgress] = useState(null)
  const [imageFileError,setImageFileError] = useState(null)
  const [imageFileUrl,setImageFileUrl] =useState(null)
  const [success,setSuccess] = useState(null)
  const imagePicker = useRef()
//   setImageFileError(null)
  console.log(imageFileProgress,imageFileError)
  const handleImageChange = (e)=>{
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
            setImageFileUrl(null)
            setImageFileProgress(null)
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                console.log(downloadURL)
                setImageFileUrl(downloadURL)
                setFormData((prev)=>{
                    console.log({...prev,"profilePicture":downloadURL})
                    return {...prev,"profilePicture":downloadURL}
                })
                setImageFileError(null)
            })      
        }
    )
  }
  const clickHandle =async(e)=>{
    e.preventDefault()
        if(Object.keys(formData).length === 0){
            console.log("hello")
            return
        }
        try{
            dispatch(updateStart())
            const res = await fetch(`/api/auth/update-user/${currentUser._id}`,{
                method:"PUT",
                headers:{'Content-Type' : 'application/json'},
                body:JSON.stringify(formData)
            })
            const resData = await res.json()
            console.log(resData._doc)
            if(res.ok !== true){
            return  dispatch(updateFailure(resData.message))
            }
            dispatch(updateSuccess(resData._doc))
            setImageFileProgress(null)
            setSuccess("Updated successfully..")
            // setTimeout(setSuccess(null),1000000000)
        }
        catch(error){
            console.log(error)
            dispatch(updateFailure(error))
        }
  }

  const changeHandle = (e)=>{
    setFormData((prev)=>{
        console.log({...prev,[e.target.id]:e.target.value})
        return {...prev,[e.target.id]:e.target.value}
    })
  }

  return (
    <div className="max-w-lg mx-auto w-full mb-32">
        <div className="overflow-y-auto max-h-screen" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                <TextInput type="text" defaultValue={currentUser.username} id="username" onChange={changeHandle}/>
                <TextInput type="email" defaultValue={currentUser.email} id="email" onChange={changeHandle}/>
                <Button type="submit" gradientDuoTone="purpleToBlue" outline onClick={clickHandle} disabled={loading}>{loading ? (<><Spinner size="sm"></Spinner><span className="pl-3">Updating...</span></>) : "Update profile"}</Button>
                {error && <Alert color={"failure"}>{error}</Alert>}
                {success && <Alert color={"success"}>{success}</Alert>}
            </form>
            
            <form className="flex flex-col gap-4 mb-12">
                <TextInput type="password" placeholder="Current Password"/> 
                <TextInput type="password" placeholder="New Password"/>
                <TextInput type="password" placeholder="ReType New Password"/>
                <Button type="submit" gradientDuoTone="purpleToBlue" outline>Update Password</Button>
            </form>
            {currentUser.role === "admin" && (
            <Link to={'/create-post'}>
                <Button
                type='button'
                gradientDuoTone='purpleToPink'
                className='w-full mb-11'
                >
                Create a post
                </Button>
            </Link>
            )}
            <form className="flex flex-col gap-4">
                <p className="text-sm">Do you want to delete your account ?</p>
                <Button type="submit" gradientDuoTone="pinkToOrange" outline>Delete Account</Button>
            </form>
        </div>
    </div>
  )
}
