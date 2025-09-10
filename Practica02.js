const map = L.map('map').setView([-12.0464, -77.0428], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markers = L.layerGroup().addTo(map);

document.getElementById('btn-ubicacion').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert("La geolocalización no es soportada por tu navegador");
    return;
  }
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    markers.clearLayers();
    L.marker([lat, lon]).addTo(markers)
      .bindPopup("¡Estás aquí!").openPopup();
    map.setView([lat, lon], 15);
  }, (err) => {
    alert("No se pudo obtener tu ubicación");
    console.error(err);
  });
});

document.getElementById('btn-buscar').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value;
  if (!query) {
    alert("Por favor ingresa una ubicación");
    return;
  }
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      markers.clearLayers();
      L.marker([lat, lon]).addTo(markers)
        .bindPopup(data[0].display_name).openPopup();
      map.setView([lat, lon], 15);
    } else {
      alert("No se encontró la ubicación");
    }
  } catch (error) {
    console.error(error);
    alert("Error al buscar la ubicación");
  }
});