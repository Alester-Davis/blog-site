import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signin from './pages/Signin.jsx'
import Signup from './pages/Signup.jsx'
import Project from './pages/Project.jsx'
import Dashboard from './pages/Dashboard.jsx'
import About from './pages/About.jsx'
import Header from './components/Header.jsx'
import { Footer } from 'flowbite-react'
import FooterComp from './components/FooterComp.jsx'
export default function App() {
  return (
    <BrowserRouter>
    <Header></Header>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sign-in' element={<Signin/>}/>
          <Route path='/sign-up' element={<Signup/>}/>
          <Route path='/project' element={<Project/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/about' element={<About/>}/>
        </Routes>
    <FooterComp></FooterComp>
    </BrowserRouter>
  )
}
