import { Link } from "react-router-dom";
import { inr } from "../utils/format";

const FALLBACK_IMAGE = "/images/default.jpg";

export default function ListingCard({ listing, showTax }) {
    return (
        <Link to={`/listings/${listing._id}`} className="listing-link">
            <div className="card col listing-card">
                <img
                    src={listing.image?.url || FALLBACK_IMAGE}
                    className="card-img-top"
                    alt={listing.title}
                    style={{ height: "20rem" }}
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                />
                <div className="card-img-overlay"></div>
                <div className="card-body">
                    <p className="card-text">
                        <b>{listing.title}</b> <br />
                        &#8377;{inr(listing.price)}/night
                        {showTax && <i>&nbsp;&nbsp;+18% GST</i>}
                    </p>
                </div>
            </div>
        </Link>
    );
}
