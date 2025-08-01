//function for geocoding
async function getCoordinates(place) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
    const data = await response.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      const coordinates = { latitude: lat, longitude: lon };
      return coordinates;
    } else {
      console.log("Place not found");
      return null;
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}
module.exports = getCoordinates;