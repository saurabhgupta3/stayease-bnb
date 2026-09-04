const FILTERS = [
    { label: "Trending", icon: "fa-solid fa-fire" },
    { label: "Rooms", icon: "fa-solid fa-bed" },
    { label: "Iconic Cities", icon: "fa-solid fa-mountain-city" },
    { label: "Mountains", icon: "fa-solid fa-mountain" },
    { label: "Castles", icon: "fa-brands fa-fort-awesome" },
    { label: "Amazing Pools", icon: "fa-solid fa-person-swimming" },
    { label: "Camping", icon: "fa-solid fa-tree" },
    { label: "Farms", icon: "fa-solid fa-cow" },
    { label: "Arctic", icon: "fa-solid fa-snowflake" },
    { label: "Domes", icon: "fa-solid fa-igloo" },
    { label: "Ships", icon: "fa-solid fa-ship" },
];

// Category chips are presentational, exactly as they were in the EJS index page.
// Making them filter for real needs a `category` field on the Listing model.
export default function Filters({ active, onSelect, showTax, onToggleTax }) {
    return (
        <div id="filters">
            {FILTERS.map((filter) => (
                <button
                    key={filter.label}
                    type="button"
                    className={`filter${active === filter.label ? " active" : ""}`}
                    onClick={() => onSelect(active === filter.label ? null : filter.label)}
                >
                    <div>
                        <i className={filter.icon}></i>
                    </div>
                    <p>{filter.label}</p>
                </button>
            ))}
            <div className="tax-toggle">
                <div className="form-check-reverse form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="switchCheckDefault"
                        checked={showTax}
                        onChange={onToggleTax}
                    />
                    <label className="form-check-label" htmlFor="switchCheckDefault">
                        Display total after taxes
                    </label>
                </div>
            </div>
        </div>
    );
}
