let currentIndex = 0;
let albumsData = [];
let filteredAlbums = [];
let favoritesOnly = false;


// ---- CAROUSEL (MAIN) ----

function randomSlide() {
  if (filteredAlbums.length === 0) return;

  const dice = document.getElementById("randomBtn");
  dice.classList.add("rolling");

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * filteredAlbums.length);
    currentIndex = randomIndex;
    updateCarouselClasses(); 
    dice.classList.remove("rolling");
  }, 1000);
}


  // Fade in on load
  window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("fade-in");
  });


function renderCarousel(albums) {
  const carousel = document.getElementById("carousel");
  carousel.innerHTML = "";

  albums.forEach((album, index) => {
    const card = document.createElement("div");
    card.className = "album";
    card.setAttribute("data-index", index);

    const key = `fav-${album.id}`;
    const isFavorite = localStorage.getItem(key) === 'true';
    const starIcon = isFavorite ? '⭐' : '☆';

    card.innerHTML = `
      <img src="${album.cover}" alt="${album.title}">
      <div class="album-info">
        <strong>${album.title}</strong><br>
        ${album.artist} (${album.year})
        <span class="fav-icon ${isFavorite ? 'active' : ''}" title="Toggle Favorite">${starIcon}</span>
      </div>
    `;
    
    

    const favIcon = card.querySelector('.fav-icon');
    favIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = localStorage.getItem(key) === 'true';
      const newState = !current;
      localStorage.setItem(key, newState);
      favIcon.classList.toggle('active', newState);
      favIcon.textContent = newState ? '⭐' : '☆';
    });

    card.onclick = () => {
      window.location.href = `album.html?id=${album.id}`;
    };

    carousel.appendChild(card);
  });

  updateCarouselClasses();
}

function updateCarouselClasses() {
  const cards = document.querySelectorAll(".album");

  cards.forEach((card, index) => {
    card.className = "album";
    card.style.willChange = "transform, opacity";

    const offset = index - currentIndex;

    if (index === currentIndex) card.classList.add("main");
    else if (index === currentIndex - 1) card.classList.add("left1");
    else if (index === currentIndex - 2) card.classList.add("left2");
    else if (index === currentIndex - 3) card.classList.add("left3");
    else if (index === currentIndex + 1) card.classList.add("right1");
    else if (index === currentIndex + 2) card.classList.add("right2");
    else if (index === currentIndex + 3) card.classList.add("right3");
    else card.classList.add("hidden");
  });
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarouselClasses();
  }
}

function nextSlide() {
  if (currentIndex < filteredAlbums.length - 1) {
    currentIndex++;
    updateCarouselClasses();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("vault-header");
  header.style.pointerEvents = "none";

  setTimeout(() => {
    header.style.pointerEvents = "auto";
  }, 1500); // Wait until slide animation finishes
});


window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});


// ---- FILTERING & INIT ----

function applyFilters() {
  const genre = document.getElementById("genre-select").value.toLowerCase();
  const decade = document.getElementById("decade-select")?.value || 'all';
  const search = document.getElementById("search-input").value.toLowerCase();

  filteredAlbums = albumsData.filter(album => {
    const isFavorite = localStorage.getItem(`fav-${album.id}`) === 'true';
    const matchFav = !favoritesOnly || isFavorite;
    const matchGenre = genre === "all" || (album.tags && album.tags.toLowerCase().includes(genre));
    const matchSearch = album.title.toLowerCase().includes(search) || album.artist.toLowerCase().includes(search);
    const matchDecade = decade === "all" || (album.year && Math.floor(album.year / 10) * 10 == parseInt(decade));
    return matchFav && matchGenre && matchSearch && matchDecade;
  });

  currentIndex = 0;
  renderCarousel(filteredAlbums);
}

fetch("records.json")
  .then(res => res.json())
  .then(data => {
    albumsData = data.sort((a, b) => a.artist.localeCompare(b.artist));
    filteredAlbums = [...albumsData];
    renderCarousel(filteredAlbums);
  });

// ---- EVENT BINDINGS ----

document.getElementById("prevBtn").onclick = prevSlide;
document.getElementById("nextBtn").onclick = nextSlide;
document.getElementById("randomBtn").onclick = randomSlide;
document.getElementById("genre-select").addEventListener("change", applyFilters);
document.getElementById("decade-select")?.addEventListener("change", applyFilters);
document.getElementById("search-input").addEventListener("input", applyFilters);

document.getElementById("toggle-view").onclick = () => {
  const isCarouselVisible = document.getElementById("carousel-view").style.display !== "none";
  document.getElementById("carousel-view").style.display = isCarouselVisible ? "none" : "block";
  document.getElementById("list-view").style.display = isCarouselVisible ? "block" : "none";
  document.getElementById("toggle-view").textContent = isCarouselVisible ? "Carousel" : "List";
};



document.getElementById("carousel").addEventListener("wheel", (event) => {
  event.preventDefault();
  event.deltaY > 0 ? nextSlide() : prevSlide();
}, { passive: false });

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "arrowright" || key === "d") nextSlide();
  else if (key === "arrowleft" || key === "a") prevSlide();
});

const favToggle = document.getElementById("fav-filter-toggle");
favToggle.addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  favToggle.classList.toggle("active", favoritesOnly);
  applyFilters();
});
