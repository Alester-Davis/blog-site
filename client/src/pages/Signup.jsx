import { Link ,useNavigate } from "react-router-dom"
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import GoogleButton from "../components/GoogleButton"

export default function Signup() {
  const [formData,setFormData] = useState({})
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  const {currentUser} = useSelector(state=>state.user)
  const navigate = useNavigate()
  useEffect(()=>{
    if(currentUser!=null){
      navigate("/")
    }
  },[])
  const changeHandler = (e)=>{
    setFormData((prev)=>{
      return {...prev,[e.target.id] : e.target.value}
    })
  }
  const formHandle = async(e)=>{
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      if(!formData.username || !formData.email || !formData.password || !formData.passwordConform){
        setLoading(false)
        return setError("All fields are required")
      }
      const res = await fetch("http://localhost:4000/api/auth/sign-up",{
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify(formData)
      })
      const resData = await res.json()
      console.log(res)
      if(res.ok === false){
        setError(resData.message)
      }
      setLoading(false)
      if(res.ok === true){
        navigate("/sign-in")
      }
    }catch(e){
      console.log(e)
      setError(e.message)
      setLoading(false)
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
          <p className="text-sm mt-5">This is a demo project. You can sign up with email and password or with google</p>
        </div>
        <div className="flex-1 mt-2">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your username"/>
              <TextInput type="text" placeholder="Username" id="username"  onChange={changeHandler}/>
            </div>
            <div>
              <Label value="Your email"/>
              <TextInput type="email" placeholder="Email" id="email" onChange={changeHandler}/>
            </div>
            <div>
              <Label value="Your password"/>
              <TextInput type="password" placeholder="Password" id="password" onChange={changeHandler}/>
            </div>
            <div>
              <Label value="Conform password"/>
              <TextInput type="password" placeholder="Conform Password" id="passwordConform" onChange={changeHandler}/>
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" onClick={formHandle} disabled={loading}>{loading ? (<><Spinner size="sm"></Spinner><span className="pl-3">Loading...</span></>) : "Sign up"}</Button>
            <GoogleButton/>
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>
                Have an account ?
            </span>
            <Link to="/sign-in" className="text-blue-500">Sign in</Link>
          </div>
          <div>
            {error && <Alert className="mt-5" color="failure">{error}</Alert>}
          </div>
        </div>
      </div>
    </div>
  )
}
