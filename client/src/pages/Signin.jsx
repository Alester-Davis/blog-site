import { Link ,useNavigate } from "react-router-dom"
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import { signInFailure,signInStart,signInSuccess } from "../redux/user/userSlice"
import { useDispatch, useSelector } from "react-redux"
import GoogleButton from "../components/GoogleButton"
export default function Signin() {
  const [formData,setFormData] = useState({})
  const {loading,error} = useSelector(state=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const changeHandler = (e)=>{
    setFormData((prev)=>{
      return {...prev,[e.target.id] : e.target.value}
    })
  }
  const formHandle = async(e)=>{
    e.preventDefault()
    dispatch(signInStart())
    try{
      if(!formData.email || !formData.password){
        return dispatch(signInFailure("All fields are required"))
      }
      const res = await fetch("/api/auth/sign-in",{
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify(formData)
      })
      const resData = await res.json()
      console.log(res)
      if(res.ok === false){
        dispatch(signInFailure(resData.message)) 
      }
      if(res.ok === true){
        dispatch(signInSuccess(resData))
        navigate("/")
      }
    }catch(e){
      dispatch(signInFailure(e.message))
    }
    console.log(formData)
  }
  return (
    <div className="min-h-screen mt-5">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <Link to="/" className='font-bold dark:text-white text-4xl'>
              <span className='px-2  py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Alester's</span>Blog
          </Link>
          <p className="text-sm mt-5">This is a demo project. You can sign in with email and password or with google</p>
        </div>
        <div className="flex-1 mt-2">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your email"/>
              <TextInput type="email" placeholder="Email" id="email" onChange={changeHandler}/>
            </div>
            <div>
              <Label value="Your password"/>
              <TextInput type="password" placeholder="Password" id="password" onChange={changeHandler}/>
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" onClick={formHandle} disabled={loading}>{loading ? (<><Spinner size="sm"></Spinner><span className="pl-3">Loading...</span></>) : "Sign in"}</Button>
            <GoogleButton/>
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>
                Didn't have an account ?
            </span>
            <Link to="/sign-up" className="text-blue-500">Sign up</Link>
          </div>
          <div>
            {error && <Alert className="mt-5" color="failure">{error}</Alert>}
          </div>
        </div>
      </div>
    </div>
  )
}
