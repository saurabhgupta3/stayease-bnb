import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import Filters from "../components/Filters";
import ListingCard from "../components/ListingCard";
import Spinner from "../components/Spinner";
import { useFlash } from "../context/FlashContext";

export default function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTax, setShowTax] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [searchParams] = useSearchParams();
    const flash = useFlash();

    const query = (searchParams.get("q") || "").trim().toLowerCase();

    useEffect(() => {
        let cancelled = false;
        api.getListings()
            .then((data) => {
                if (!cancelled) setListings(data.listings);
            })
            .catch((err) => {
                if (!cancelled) flash.error(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const visible = useMemo(() => {
        if (!query) return listings;
        return listings.filter((l) =>
            [l.title, l.location, l.country].some((field) =>
                (field || "").toLowerCase().includes(query)
            )
        );
    }, [listings, query]);

    if (loading) return <Spinner />;

    return (
        <>
            <Filters
                active={activeFilter}
                onSelect={setActiveFilter}
                showTax={showTax}
                onToggleTax={() => setShowTax((v) => !v)}
            />

            {query && (
                <p className="mt-4 mb-0 text-muted">
                    {visible.length} result{visible.length === 1 ? "" : "s"} for "{query}"
                </p>
            )}

            {visible.length === 0 ? (
                <p className="mt-4">No listings found.</p>
            ) : (
                <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-3">
                    {visible.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} showTax={showTax} />
                    ))}
                </div>
            )}
        </>
    );
}
