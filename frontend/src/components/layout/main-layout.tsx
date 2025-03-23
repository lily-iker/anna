import { Outlet } from "react-router-dom"
import Footer from "./footer"
import Navbar from "./navbar"

const MainLayout = () => {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <Outlet/>

            <Footer />
        </main>
    )
}

export default MainLayout