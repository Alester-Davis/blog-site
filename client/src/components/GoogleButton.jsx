import { Button } from 'flowbite-react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { app } from '../../firebase'
import {GoogleAuthProvider,signInWithPopup,getAuth} from 'firebase/auth'
import { signInSuccess } from '../redux/user/userSlice'

export default function GoogleButton() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const auth = getAuth(app)   
    const formHandler = async()=>{
        const google = new GoogleAuthProvider()
        google.setCustomParameters({prompt : "select_account"})
        try{
            const resultFromGoogle = await signInWithPopup(auth,google)
            console.log(resultFromGoogle)
            const res = await fetch("/api/auth/google",{
                method:"POST",
                headers: {"Content-Type" : "application/json"},
                body:JSON.stringify({
                    name : resultFromGoogle.user.displayName,
                    email :  resultFromGoogle.user.email,
                    googlePhotoUrl : resultFromGoogle.user.photoURL
                })
            })
            const resData = await res.json()
            if(res.ok){
                dispatch(signInSuccess(resData))
                navigate("/")
            }
        }
        catch(error){
            console.log(error)
        }
    }
  return (
    <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={formHandler}>
        <AiFillGoogleCircle  className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
