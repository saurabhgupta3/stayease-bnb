import { Fragment } from "react";

const STARS = [
    { value: 1, title: "Terrible", label: "1 star" },
    { value: 2, title: "Not good", label: "2 stars" },
    { value: 3, title: "Average", label: "3 stars" },
    { value: 4, title: "Very good", label: "4 stars" },
    { value: 5, title: "Amazing", label: "5 stars" },
];

// ratings.css targets `.starability-heartbeat > input/label` with `+` and `~`
// combinators, so the inputs and labels must stay flat siblings — hence Fragment.
export default function StarRatingInput({ value, onChange, name = "rating" }) {
    return (
        <fieldset className="starability-heartbeat">
            <input
                type="radio"
                id={`${name}-no-rate`}
                className="input-no-rate"
                name={name}
                value="0"
                checked={!value}
                onChange={() => onChange(0)}
                aria-label="No rating."
            />
            {STARS.map((star) => (
                <Fragment key={star.value}>
                    <input
                        type="radio"
                        id={`${name}-${star.value}`}
                        name={name}
                        value={star.value}
                        checked={value === star.value}
                        onChange={() => onChange(star.value)}
                    />
                    <label htmlFor={`${name}-${star.value}`} title={star.title}>
                        {star.label}
                    </label>
                </Fragment>
            ))}
        </fieldset>
    );
}
