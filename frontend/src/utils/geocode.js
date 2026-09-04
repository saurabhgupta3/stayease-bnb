// Same Nominatim lookup the EJS new-listing form did inline, so the browser
// still resolves coordinates before the listing is submitted.
export async function getCoordinates(place) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error fetching location");
    }
    const data = await res.json();
    if (!data.length) {
        throw new Error(`Could not find "${place}" on the map`);
    }
    return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
    };
}
