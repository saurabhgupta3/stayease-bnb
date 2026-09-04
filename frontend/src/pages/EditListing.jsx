import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import ListingForm from "../components/ListingForm";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";

export default function EditListing() {
    const { id } = useParams();
    const navigate = useNavigate();
    const flash = useFlash();
    const { user } = useAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        api.getListing(id)
            .then((data) => {
                if (cancelled) return;
                // The EJS route gated this page on isOwner; the API still enforces
                // it on PUT, but check here too so non-owners never see the form.
                if (!data.listing.owner || data.listing.owner._id !== user?._id) {
                    flash.error("You don't have permission");
                    navigate(`/listings/${id}`, { replace: true });
                    return;
                }
                setListing(data.listing);
            })
            .catch((err) => {
                if (cancelled) return;
                flash.error(err.message);
                navigate("/listings", { replace: true });
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) return <Spinner />;
    if (!listing) return null;

    // Same Cloudinary transform the EJS edit page used for its thumbnail.
    const originalImageUrl = (listing.image?.url || "").replace("/upload", "/upload/w_250");

    const handleSubmit = async (formData) => {
        const data = await api.updateListing(id, formData);
        flash.success(data.message);
        navigate(`/listings/${id}`);
    };

    return (
        <div className="row">
            <div className="col-md-8 offset-md-2 mt-3">
                <h1>Edit your listing</h1>
                <ListingForm
                    initialValues={{
                        title: listing.title || "",
                        description: listing.description || "",
                        location: listing.location || "",
                        price: listing.price ?? "",
                        country: listing.country || "",
                    }}
                    originalImageUrl={originalImageUrl}
                    submitLabel="edit"
                    submitClassName="btn btn-dark edit-btn mt-3"
                    onSubmit={handleSubmit}
                    onError={flash.error}
                />
            </div>
        </div>
    );
}
