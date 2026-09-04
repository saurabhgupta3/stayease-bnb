import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import EditListing from "./pages/EditListing";
import Listings from "./pages/Listings";
import Login from "./pages/Login";
import NewListing from "./pages/NewListing";
import NotFound from "./pages/NotFound";
import ShowListing from "./pages/ShowListing";
import Signup from "./pages/Signup";

// Keying by id remounts the page on navigation between listings, which resets
// its loading/review state without an effect.
function ShowListingRoute() {
    const { id } = useParams();
    return <ShowListing key={id} />;
}

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/listings" replace />} />
                <Route path="/listings" element={<Listings />} />

                {/* Static segment before :id so /listings/new is not read as an id. */}
                <Route element={<RequireAuth />}>
                    <Route path="/listings/new" element={<NewListing />} />
                    <Route path="/listings/:id/edit" element={<EditListing />} />
                </Route>

                <Route path="/listings/:id" element={<ShowListingRoute />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
