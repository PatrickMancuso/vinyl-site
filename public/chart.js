let albums = [];

fetch('records.json')
  .then(res => res.json())
  .then(data => {
    albums = data;
    populateAlbumSelector();
    createGrid(3); // default
  });

document.getElementById('chart-size').addEventListener('change', e => {
  createGrid(parseInt(e.target.value));
});

function populateAlbumSelector() {
  const container = document.getElementById('album-selector');
  container.innerHTML = '';
  albums.forEach(album => {
    const wrapper = document.createElement('div');
    wrapper.className = 'album-container';

    const div = document.createElement('div');
    div.className = 'album-thumb';
    div.style.backgroundImage = `url(${album.cover})`;
    div.setAttribute('draggable', true);
    div.dataset.albumId = album.id;

    const info = document.createElement('div');
    info.className = 'album-info';
    info.innerHTML = `<strong>${album.title}</strong><br>${album.artist}`;

    wrapper.appendChild(div);
    wrapper.appendChild(info);
    container.appendChild(wrapper);
  });
}


function createGrid(size) {
  const grid = document.getElementById('chart-grid');
  grid.className = '';
  grid.classList.add(`grid-${size}`);
  grid.innerHTML = '';

  const totalSlots = size * size;
  for (let i = 0; i < totalSlots; i++) {
    const slot = document.createElement('div');
    slot.className = 'chart-slot';
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', handleDrop);
    grid.appendChild(slot);
  }
}

function handleDrop(e) {
  e.preventDefault();
  const albumId = e.dataTransfer.getData('text/plain');
  const album = albums.find(a => a.id === albumId);
  if (!album) return;

  const slot = e.currentTarget;
  slot.innerHTML = `
    <img src="${album.cover}" alt="${album.title}">
    <div class="caption">${album.title} – ${album.artist}</div>
  `;
}

document.addEventListener('dragstart', e => {
  if (e.target.classList.contains('album-thumb')) {
    e.dataTransfer.setData('text/plain', e.target.dataset.albumId);
  }
});

document.getElementById('download-chart').addEventListener('click', () => {
  html2canvas(document.getElementById('chart-grid')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'vinyl-chart.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});
