import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import ListingMap from "../components/ListingMap";
import Spinner from "../components/Spinner";
import StarRatingInput from "../components/StarRatingInput";
import StarRatingResult from "../components/StarRatingResult";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";
import { inr } from "../utils/format";

const FALLBACK_IMAGE = "/images/default.jpg";

export default function ShowListing() {
    const { id } = useParams();
    const navigate = useNavigate();
    const flash = useFlash();
    const { user } = useAuth();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [validated, setValidated] = useState(false);
    const [busy, setBusy] = useState(false);

    const reload = () => api.getListing(id).then((data) => setListing(data.listing));

    useEffect(() => {
        let cancelled = false;
        api.getListing(id)
            .then((data) => {
                if (!cancelled) setListing(data.listing);
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

    const isOwner = Boolean(user && listing.owner && user._id === listing.owner._id);

    const handleDeleteListing = async () => {
        if (!window.confirm("Delete this listing? This cannot be undone.")) return;
        try {
            const data = await api.deleteListing(id);
            flash.success(data.message);
            navigate("/listings");
        } catch (err) {
            flash.error(err.message);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        setValidated(true);
        if (!comment.trim()) return;

        setBusy(true);
        try {
            // The EJS form defaulted to the no-rate radio, which submitted 1.
            const data = await api.createReview(id, { rating: rating || 1, comment });
            flash.success(data.message);
            setRating(0);
            setComment("");
            setValidated(false);
            await reload();
        } catch (err) {
            flash.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const data = await api.deleteReview(id, reviewId);
            flash.success(data.message);
            await reload();
        } catch (err) {
            flash.error(err.message);
        }
    };

    return (
        <div className="row mt-3">
            <div className="col-md-8 offset-md-3">
                <h3>
                    <b>{listing.title}</b>
                </h3>
            </div>

            <div className="card col-md-6 offset-md-3 show-card listing-card">
                <img
                    src={listing.image?.url || FALLBACK_IMAGE}
                    className="card-img-top show-img"
                    alt={listing.title}
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                />
                <div className="card-body">
                    <div className="card-text">
                        <p>
                            Owned by <i>{listing.owner?.username || "unknown"}</i>
                        </p>
                        <p>{listing.description}</p>
                        <p>{listing.location}</p>
                        <p>&#8377;{inr(listing.price)}</p>
                        <p>{listing.country}</p>
                    </div>
                </div>
            </div>

            {isOwner && (
                <div className="col-md-6 offset-md-3 mb-3">
                    <div className="btns">
                        <Link to={`/listings/${listing._id}/edit`} className="btn btn-dark edit-btn">
                            edit
                        </Link>
                        <button className="btn btn-dark" onClick={handleDeleteListing}>
                            delete
                        </button>
                    </div>
                </div>
            )}

            <div className="col-md-8 offset-md-3 mb-3">
                <hr />
                {user && (
                    <>
                        <h4>Leave a review</h4>
                        <form
                            noValidate
                            className={`needs-validation${validated ? " was-validated" : ""}`}
                            onSubmit={handleAddReview}
                        >
                            <div className="mb-3 mt-3">
                                <label className="form-label">Rating</label>
                                <StarRatingInput value={rating} onChange={setRating} />
                            </div>
                            <div className="mb-3 mt-3">
                                <label htmlFor="comment" className="form-label">
                                    Comment
                                </label>
                                <textarea
                                    id="comment"
                                    rows="5"
                                    className="form-control"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                                <div className="invalid-feedback">
                                    please add some comment to submit
                                </div>
                            </div>
                            <button className="btn btn-outline-dark" disabled={busy}>
                                submit
                            </button>
                        </form>
                        <hr />
                    </>
                )}

                {listing.reviews?.length > 0 && (
                    <>
                        <h4>All reviews</h4>
                        <div className="row">
                            {listing.reviews.map((review) => (
                                <div className="card col-md-5 mb-3 ms-md-3" key={review._id}>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            @{review.author?.username || "unknown"}
                                        </h5>
                                        <StarRatingResult rating={review.rating} />
                                        <p className="card-text">{review.comment}</p>
                                        {user && review.author && user._id === review.author._id && (
                                            <button
                                                className="btn btn-sm btn-dark"
                                                onClick={() => handleDeleteReview(review._id)}
                                            >
                                                delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="col-md-6 offset-md-3 mb-3">
                <h3>Where you will be</h3>
                <ListingMap coordinates={listing.geometry?.coordinates} title={listing.title} />
            </div>
        </div>
    );
}
