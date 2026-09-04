import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Flash from "./Flash";

export default function Layout() {
    return (
        <>
            <Navbar />
            <div className="container page-container">
                <Flash />
                <Outlet />
            </div>
            <Footer />
        </>
    );
}
