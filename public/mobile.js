let currentIndex = 0;
let albumsData = [];
let filteredAlbums = [];
let favoritesOnly = false;

function renderCarousel(albums) {
  const carousel = document.getElementById("carousel");
  carousel.innerHTML = "";

  albums.forEach((album, index) => {
    const key = `fav-${album.id}`;
    const isFavorite = localStorage.getItem(key) === 'true';
    const star = isFavorite ? '⭐' : '☆';

    const card = document.createElement("div");
    card.className = "album";
    card.innerHTML = `
      <img src="${album.cover}" alt="${album.title}">
      <div>
        <strong>${album.title}</strong><br>
        ${album.artist} (${album.year})<br>
        <span class="fav-icon">${star}</span>
      </div>
    `;

    card.querySelector(".fav-icon").onclick = (e) => {
      e.stopPropagation();
      const newState = !isFavorite;
      localStorage.setItem(key, newState);
      applyFilters();
    };

    card.onclick = () => {
      window.location.href = `album.html?id=${album.id}`;
    };

    carousel.appendChild(card);
  });
}

function applyFilters() {
  const search = document.getElementById("search-input").value.toLowerCase();
  const genre = document.getElementById("genre-select").value.toLowerCase();
  const decade = document.getElementById("decade-select").value;

  filteredAlbums = albumsData.filter(album => {
    const isFav = localStorage.getItem(`fav-${album.id}`) === 'true';
    const matchFav = !favoritesOnly || isFav;
    const matchSearch = album.title.toLowerCase().includes(search) || album.artist.toLowerCase().includes(search);
    const matchGenre = genre === "all" || (album.tags && album.tags.toLowerCase().includes(genre));
    const matchDecade = decade === "all" || Math.floor(album.year / 10) * 10 == parseInt(decade);
    return matchFav && matchSearch && matchGenre && matchDecade;
  });

  renderCarousel(filteredAlbums);
}

fetch("records.json")
  .then(res => res.json())
  .then(data => {
    albumsData = data;
  albumsData = data.sort((a, b) => a.title.localeCompare(b.title));
    applyFilters();
  });

document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("genre-select").addEventListener("change", applyFilters);
document.getElementById("decade-select").addEventListener("change", applyFilters);

document.getElementById("fav-filter-toggle").addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  document.getElementById("fav-filter-toggle").classList.toggle("active", favoritesOnly);
  applyFilters();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentIndex > 0) currentIndex--;
  scrollCarouselTo(currentIndex);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentIndex < filteredAlbums.length - 1) currentIndex++;
  scrollCarouselTo(currentIndex);
});

function scrollCarouselTo(index) {
  const carousel = document.getElementById("carousel");
  const cards = carousel.querySelectorAll(".album");
  if (cards[index]) cards[index].scrollIntoView({ behavior: "smooth", inline: "center" });
}
