let albumsData = [];
let isGridView = true;
let favoritesOnly = false;

const container = document.getElementById("album-container");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");
const decadeFilter = document.getElementById("decade-filter");
const viewToggle = document.getElementById("view-toggle");
const favToggle = document.getElementById("fav-filter-toggle");

fetch("records.json")
  .then(res => res.json())
  .then(data => {
    albumsData = data;
    renderAlbums();
  });

searchInput.addEventListener("input", renderAlbums);
genreFilter.addEventListener("change", renderAlbums);
decadeFilter.addEventListener("change", renderAlbums);

favToggle.addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  favToggle.classList.toggle("active", favoritesOnly);
  renderAlbums();
});

viewToggle.addEventListener("click", () => {
  isGridView = !isGridView;
  container.className = isGridView ? "album-grid" : "album-list";
  viewToggle.textContent = isGridView ? "Switch to List View" : "Switch to Grid View";
  renderAlbums();
});

function renderAlbums() {
  const search = searchInput.value.toLowerCase();
  const genre = genreFilter.value.toLowerCase();
  const decade = decadeFilter.value;
  
  container.innerHTML = "";

  albumsData
    .filter(album => {
      const inFav = !favoritesOnly || localStorage.getItem(`fav-${album.id}`) === "true";
      const matchSearch =
        album.title.toLowerCase().includes(search) ||
        album.artist.toLowerCase().includes(search);
      const matchGenre = !genre || (album.tags && album.tags.toLowerCase().includes(genre));
      const matchDecade = !decade || Math.floor(album.year / 10) * 10 == decade;
      return inFav && matchSearch && matchGenre && matchDecade;
    })
    .forEach(album => {
      const favKey = `fav-${album.id}`;
      const isFav = localStorage.getItem(favKey) === "true";

      const div = document.createElement("div");
      div.className = "album " + (isGridView ? "album-grid" : "album-list");
      div.onclick = () => window.location.href = `detail.html?id=${album.id}`;

      const img = document.createElement("img");
      img.src = album.cover;
      img.alt = album.title;

      const info = document.createElement("div");
      info.className = "info";

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = album.title;

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `${album.artist} (${album.year})`;

      const favIcon = document.createElement("div");
      favIcon.className = "fav-icon";
      favIcon.textContent = isFav ? "★" : "☆";
      favIcon.classList.toggle("active", isFav);
      favIcon.addEventListener("click", e => {
        e.stopPropagation();
        localStorage.setItem(favKey, (!isFav).toString());
        renderAlbums();
      });

      info.append(title, meta, favIcon);
      div.append(img, info);
      container.appendChild(div);
    });
}
