let albums = [];
let filteredAlbums = [];

function applyFilters() {
  const genre = document.getElementById("genre-select").value.toLowerCase();
  const decade = document.getElementById("decade-select").value;
  const search = document.getElementById("search-input").value.toLowerCase();

  filteredAlbums = albums.filter(album => {
    const matchGenre = genre === "all" || (album.tags && album.tags.toLowerCase().includes(genre));
    const matchSearch = album.title.toLowerCase().includes(search) || album.artist.toLowerCase().includes(search);
    const matchDecade = decade === "all" || (album.year && Math.floor(album.year / 10) * 10 == parseInt(decade));
    return  matchGenre && matchSearch && matchDecade;
  });

  populateAlbumSelector(); // only show filtered
}

fetch('records.json')
  .then(res => res.json())
  .then(data => {
    albums = data;
    filteredAlbums = [...albums]; 
    applyFilters();
    createGrid(3); 
  });

document.getElementById('chart-size').addEventListener('change', e => {
  createGrid(parseInt(e.target.value));
});

function populateAlbumSelector() {
  const container = document.getElementById('album-selector');
  container.innerHTML = '';
  filteredAlbums.forEach(album => {
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

// Wait for all images inside a container to load before continuing
function waitForImagesToLoad(container) {
  const images = container.querySelectorAll('img');
  const promises = [];

  images.forEach(img => {
    if (!img.complete) {
      promises.push(new Promise(resolve => {
        img.onload = img.onerror = () => resolve();
      }));
    }
  });

  return Promise.all(promises);
}

// Download button handler with image load check and html2canvas options
document.getElementById('download-chart').addEventListener('click', () => {
  const chartGrid = document.getElementById('chart-grid');

  waitForImagesToLoad(chartGrid).then(() => {
    html2canvas(chartGrid, { useCORS: true, backgroundColor: '#fff' }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'vinyl-chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(err => {
      console.error('html2canvas error:', err);
      alert('Error capturing chart image.');
    });
  });
});

document.getElementById("genre-select").addEventListener("change", applyFilters);
document.getElementById("decade-select").addEventListener("change", applyFilters);
document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("fav-filter-toggle")?.addEventListener("click", () => {
  applyFilters();
});
