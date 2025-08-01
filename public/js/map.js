let map = L.map("map").setView([coords[1], coords[0]], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

console.log(coords);

let marker = L.marker([coords[1], coords[0]]).addTo(map);
marker.bindPopup(`<b>${title}</b><br>exact location will be provided after booking`).openPopup();
