import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import ListingForm from "../components/ListingForm";
import { useFlash } from "../context/FlashContext";

export default function NewListing() {
    const navigate = useNavigate();
    const flash = useFlash();

    const handleSubmit = async (formData) => {
        const data = await api.createListing(formData);
        flash.success(data.message);
        navigate("/listings");
    };

    return (
        <div className="row">
            <div className="col-md-8 offset-md-2 mt-3">
                <h1>create new listing</h1>
                <ListingForm
                    requireImage
                    submitLabel="submit"
                    submitClassName="btn btn-dark add-btn mt-3"
                    onSubmit={handleSubmit}
                    onError={flash.error}
                />
            </div>
        </div>
    );
}
