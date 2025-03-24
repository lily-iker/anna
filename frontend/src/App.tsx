import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage"
import { Navigate, Route, Routes } from 'react-router-dom'
import Loading from "./components/loading";
import MainLayout from "./components/layout/main-layout";
import { useAuthStore } from "./stores/useAuthStore";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";


function App() {
  
  const { authUser, fetchAuthUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuthUser();
  }, []);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 0.5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (<Loading/>);
  }

  return (
    <>
     <Routes>
       <Route element={<MainLayout/>}>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to={"/"}/>}/>
       </Route>
       <Route path="/admin" element={<AdminPage/>}/>      
     </Routes>
    </>
   )
}

export default App
