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
      vinyl.classList.remove('spin'); // reset spin
      void vinyl.offsetWidth;         // force reflow
      vinyl.classList.add('spin');    // restart spin
      setTimeout(() => vinyl.classList.remove('spin'), 5000);
    });
  });
};

