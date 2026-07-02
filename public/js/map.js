const mapDiv = document.getElementById("map");
const listing = JSON.parse(mapDiv.dataset.listing);
const mapToken = mapDiv.dataset.token;

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates,
    zoom: 9
});

const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25 })
    .setHTML(
        `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
    ))
    .addTo(map);
