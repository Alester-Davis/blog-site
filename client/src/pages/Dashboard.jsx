import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DashSideBoard from "../components/DashSideBoard"
import DashProfile from "../components/DashProfile"
import DashPost from "../components/DashPost"
import DashUser from "../components/DashUser"

export default function Dashboard() {
  const location = useLocation()
  const [tab,setTab] = useState('')
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tab = urlParams.get("tab")
    if(tab){
      setTab(tab)
    }
  },[location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div>
        <DashSideBoard/>
      </div>
      {(tab==="profile") && <DashProfile/>}
      {(tab==="post") && <DashPost/>}
      {(tab==="user") && <DashUser/>}
    </div>
  )
}
