async function initMap() {
  const records = await fetch('records.json').then(res => res.json());
  const coordMap = await fetch('map-coordinates.json').then(res => res.json());
  const pinLayer = document.getElementById('pin-layer');

  records.forEach(album => {
    const origin = album.artist_origin || "Unknown";
    const coords = coordMap[origin];
    if (!coords) return;

    const pin = document.createElement('div');
    pin.className = 'pin';
    pin.style.left = `${coords[0]}px`;
    pin.style.top = `${coords[1]}px`;
    pin.style.setProperty('--cover-url', `url(${album.cover})`);
    pin.style.setProperty('background-image', `url(${album.cover})`);
    pin.onmouseover = () => {
      pin.style.setProperty('--cover-url', `url(${album.cover})`);
    };
    pinLayer.appendChild(pin);
  });

  enableZoomPan();
}

function enableZoomPan() {
  const mapContainer = document.getElementById('map-container');
  let scale = 1;
  let originX = 0, originY = 0;
  let isPanning = false, startX, startY;

  mapContainer.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= delta;
    mapContainer.style.transform = `scale(${scale}) translate(${originX}px, ${originY}px)`;
  });

  mapContainer.addEventListener('mousedown', e => {
    isPanning = true;
    startX = e.clientX;
    startY = e.clientY;
    mapContainer.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isPanning = false;
    mapContainer.style.cursor = 'grab';
  });

  window.addEventListener('mousemove', e => {
    if (!isPanning) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    originX += dx / scale;
    originY += dy / scale;
    mapContainer.style.transform = `scale(${scale}) translate(${originX}px, ${originY}px)`;
    startX = e.clientX;
    startY = e.clientY;
  });
}

initMap();
