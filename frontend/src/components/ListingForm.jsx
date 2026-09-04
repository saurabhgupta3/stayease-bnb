import { useRef, useState } from "react";
import { getCoordinates } from "../utils/geocode";

const EMPTY = { title: "", description: "", location: "", price: "", country: "" };

/**
 * Shared by the new + edit pages. Reproduces the Bootstrap `needs-validation`
 * behaviour the EJS forms got from public/js/script.js, and resolves the
 * location to coordinates before handing a FormData up to the caller.
 */
export default function ListingForm({
    initialValues,
    originalImageUrl,
    requireImage = false,
    submitLabel = "submit",
    submitClassName = "btn btn-dark add-btn mt-3",
    onSubmit,
    onError,
}) {
    const formRef = useRef(null);
    const [values, setValues] = useState({ ...EMPTY, ...initialValues });
    const [file, setFile] = useState(null);
    const [validated, setValidated] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);
        if (!formRef.current.checkValidity()) return;

        setSubmitting(true);
        try {
            // The old EJS form geocoded on submit too; on edit this also keeps the
            // map in sync when the location changes.
            const coords = await getCoordinates(values.location);

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("location", values.location);
            formData.append("price", values.price);
            formData.append("country", values.country);
            formData.append("latitude", coords.latitude);
            formData.append("longitude", coords.longitude);
            if (file) formData.append("image", file);

            await onSubmit(formData);
        } catch (err) {
            onError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            ref={formRef}
            noValidate
            className={`needs-validation${validated ? " was-validated" : ""}`}
            onSubmit={handleSubmit}
        >
            <div className="mb-3">
                <label htmlFor="title" className="form-label">
                    Title :{" "}
                </label>
                <input
                    type="text"
                    id="title"
                    placeholder="enter title"
                    className="form-control"
                    value={values.title}
                    onChange={update("title")}
                    required
                />
                <div className="valid-feedback">Title looks good!</div>
                <div className="invalid-feedback">Title required</div>
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">
                    Description :{" "}
                </label>
                <textarea
                    id="description"
                    placeholder="enter description"
                    className="form-control"
                    value={values.description}
                    onChange={update("description")}
                    required
                />
                <div className="invalid-feedback">Please enter valid description</div>
            </div>

            <div className="mb-3">
                <label htmlFor="location" className="form-label">
                    Location :{" "}
                </label>
                <input
                    type="text"
                    id="location"
                    placeholder="enter location"
                    className="form-control"
                    value={values.location}
                    onChange={update("location")}
                    required
                />
                <div className="invalid-feedback">Location should be valid</div>
            </div>

            <div className="row">
                <div className="mb-3 col-md-4">
                    <label htmlFor="price" className="form-label">
                        Price :{" "}
                    </label>
                    <input
                        type="number"
                        id="price"
                        min="0"
                        placeholder="enter price"
                        className="form-control"
                        value={values.price}
                        onChange={update("price")}
                        required
                    />
                    <div className="invalid-feedback">Price should be valid</div>
                </div>
                <div className="mb-3 col-md-8">
                    <label htmlFor="country" className="form-label">
                        Country :{" "}
                    </label>
                    <input
                        type="text"
                        id="country"
                        placeholder="enter country"
                        className="form-control"
                        value={values.country}
                        onChange={update("country")}
                        required
                    />
                    <div className="invalid-feedback">Country should be valid</div>
                </div>
            </div>

            {originalImageUrl && (
                <div className="mb-3">
                    Original Listing Image <br />
                    <img className="editImageDisplay" src={originalImageUrl} alt="current listing" />
                </div>
            )}

            <div className="mb-3">
                <label htmlFor="image" className="form-label">
                    {originalImageUrl ? "Upload New Image : " : "Upload Listing Image : "}
                </label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/png, image/jpeg"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                    required={requireImage}
                />
                <div className="invalid-feedback">Please choose an image</div>
            </div>

            <button className={submitClassName} disabled={submitting}>
                {submitting ? "saving..." : submitLabel}
            </button>
        </form>
    );
}
