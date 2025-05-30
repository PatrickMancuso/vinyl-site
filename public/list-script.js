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

// Vinyl spin logic — after everything (including images) is loaded
window.onload = () => {
  document.querySelectorAll('.spinnable-vinyl').forEach(vinyl => {
    vinyl.addEventListener('click', () => {
      vinyl.classList.remove('spin');
      void vinyl.offsetWidth;
      vinyl.classList.add('spin');
      setTimeout(() => vinyl.classList.remove('spin'), 5000);
    });
  });
};
