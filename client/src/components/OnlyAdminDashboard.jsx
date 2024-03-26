import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function OnlyAdminDashboard() {
    const {currentUser} = useSelector((state)=>state.user)
    return currentUser && currentUser.role === "admin" ? <Outlet/> : <Navigate to="/sign-in"/>
}
