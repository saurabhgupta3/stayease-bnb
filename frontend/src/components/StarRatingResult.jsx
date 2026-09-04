// Read-only starability widget, same markup/CSS the EJS show page used.
export default function StarRatingResult({ rating }) {
    return (
        <p
            className="starability-result card-text"
            data-rating={rating}
            aria-label={`Rated ${rating} out of 5`}
        ></p>
    );
}
