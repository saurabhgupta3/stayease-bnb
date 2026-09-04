import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Same Leaflet/OSM setup as the old public/js/map.js, scoped to this component.
export default function ListingMap({ coordinates, title }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !Array.isArray(coordinates) || coordinates.length < 2) {
            return undefined;
        }

        const [lng, lat] = coordinates;
        const map = L.map(containerRef.current).setView([lat, lng], 13);
        mapRef.current = map;

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${title}</b><br>exact location will be provided after booking`)
            .openPopup();

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [coordinates, title]);

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
        return <p className="text-muted">Location is not available for this listing.</p>;
    }

    return <div id="map" ref={containerRef}></div>;
}
