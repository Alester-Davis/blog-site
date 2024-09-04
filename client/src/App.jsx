import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import Project from './pages/Project.jsx';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import Header from './components/Header.jsx';
// import FooterComp from './components/FooterComp.jsx';
import OnlyAdminDashboard from './components/OnlyAdminDashboard.jsx';
import CreatePost from './pages/CreatePost.jsx';
import UpdatePost from './pages/UpdatePost.jsx';
import PostPage from './pages/PostPage.jsx';
import DisplayPost from './pages/DisplayPost.jsx';

function App() {
  const location = useLocation();
  const showHeader = !location.pathname.includes('/dashboard');

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/project" element={<Project />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route element={<OnlyAdminDashboard />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/post" element={<DisplayPost />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      {/* <FooterComp></FooterComp> */}
    </>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
