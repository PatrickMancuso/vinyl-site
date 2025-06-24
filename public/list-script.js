fetch("records.json")
  .then(res => res.json())
  .then(data => {
    const listContainer = document.getElementById("list-container");
    const countDisplay = document.getElementById("record-count");
    data.sort((a, b) => a.artist.localeCompare(b.artist));

    countDisplay.textContent = `${data.length} album${data.length !== 1 ? "s" : ""}`;

    const albumsData = data;

    function applyFilters() {
      const genre = document.getElementById("genre-select").value.toLowerCase();
      const decade = document.getElementById("decade-select").value;
      const search = document.getElementById("search-input").value.toLowerCase();

      // Start with hidden + reset fade-in class for smooth reanimation
      listContainer.classList.add('hidden');
      listContainer.classList.remove('fade-in');

      const filteredAlbums = albumsData.filter(album => {
        const matchSearch =
          album.title.toLowerCase().includes(search) ||
          album.artist.toLowerCase().includes(search);
        const matchGenre =
          genre === "all" ||
          (album.tags && album.tags.toLowerCase().includes(genre));
        const matchDecade =
          decade === "all" ||
          (album.year && Math.floor(album.year / 10) * 10 == parseInt(decade));

        return matchSearch && matchGenre && matchDecade;
      });

      listContainer.innerHTML = "";

      filteredAlbums.forEach(album => {
        const albumItem = document.createElement("div");
        albumItem.className = "album-item";

        albumItem.innerHTML = `
          <img src="${album.cover}" alt="${album.title} Cover" class="album-icon">
          <div class="album-info">
            <h3>${album.title}</h3>
            <p>${album.artist} ${album.year ? `(${album.year})` : ""}</p>
          </div>
        `;

        albumItem.addEventListener("click", () => {
          window.location.href = `album.html?id=${album.id}`;
        });

        listContainer.appendChild(albumItem);
      });

      countDisplay.textContent = `${filteredAlbums.length} Album${filteredAlbums.length !== 1 ? "s" : ""}`;

      // Wait for all images to load before fade-in
      const images = listContainer.querySelectorAll('img');
      let loadedCount = 0;

      if (images.length === 0) {
        // Force reflow and animate immediately if no images
        void listContainer.offsetWidth;
        listContainer.classList.remove('hidden');
        listContainer.classList.add('fade-in');
        return;
      }

      images.forEach(img => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.onload = img.onerror = () => {
            loadedCount++;
            if (loadedCount === images.length) {
              // All images loaded — animate
              void listContainer.offsetWidth;
              listContainer.classList.remove('hidden');
              listContainer.classList.add('fade-in');
            }
          };
        }
      });

      // In case all images already complete at start
      if (loadedCount === images.length) {
        void listContainer.offsetWidth;
        listContainer.classList.remove('hidden');
        listContainer.classList.add('fade-in');
      }
    }

    // Initial display
    applyFilters();

    // Attach filter handlers
    document.getElementById("search-input").addEventListener("input", applyFilters);
    document.getElementById("genre-select").addEventListener("change", applyFilters);
    document.getElementById("decade-select").addEventListener("change", applyFilters);
  });


// Layout Toggle Logic
const layoutToggleBtn = document.getElementById("layout-toggle");
const layoutIcon = document.getElementById("layout-icon");
const listContainer = document.getElementById("list-container");

// Your list icon (already uploaded)
const listIconURL = "https://cdn.glitch.global/5a61e06d-3a29-4f64-9308-866c806f9357/list%20icon.svg?v=1749915539078";

// Grid icon (inline base64 SVG)
const gridIconURL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M3 3h6v6H3V3zm6 6h6v6h-6V9zm6 6h6v6h-6v-6zM3 9h6v6H3V9zm0 6h6v6H3v-6zm12-6h6V3h-6v6z'/%3E%3C/svg%3E";

layoutToggleBtn.addEventListener("click", () => {
  const isCompact = listContainer.classList.toggle("compact-view");
  layoutIcon.src = isCompact ? gridIconURL : listIconURL;
});

