
//import { auth, onAuthStateChanged } from './firebase-init.js';


/*onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
*/
    fetch("records.json")
      .then(res => res.json())
      .then(data => {
        const listContainer = document.getElementById("list-container");
        const countDisplay = document.getElementById("record-count");

        // Filter albums to only those belonging to current user
        const userAlbums = data.filter(album => album.userId === uid);

        userAlbums.sort((a, b) => a.artist.localeCompare(b.artist));

        countDisplay.textContent = `${userAlbums.length} album${userAlbums.length !== 1 ? "s" : ""}`;

        const albumsData = userAlbums;

        function applyFilters() {
          const genre = document.getElementById("genre-select").value.toLowerCase();
          const decade = document.getElementById("decade-select").value;
          const search = document.getElementById("search-input").value.toLowerCase();

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

          if (filteredAlbums.length === 0) {
            listContainer.innerHTML = "<p>No albums found matching your criteria.</p>";
          }

          filteredAlbums.forEach(album => {
            const albumItem = document.createElement("div");
            albumItem.className = "album-item";

            albumItem.innerHTML = `
              <img src="${album.cover}" alt="${album.title} Cover" class="album-icon spinnable-vinyl">
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

          const images = listContainer.querySelectorAll('img');
          let loadedCount = 0;

          if (images.length === 0) {
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
                  void listContainer.offsetWidth;
                  listContainer.classList.remove('hidden');
                  listContainer.classList.add('fade-in');
                }
              };
            }
          });

          if (loadedCount === images.length) {
            void listContainer.offsetWidth;
            listContainer.classList.remove('hidden');
            listContainer.classList.add('fade-in');
          }
        }

        // Initial display and attach filter handlers
        applyFilters();
        document.getElementById("search-input").addEventListener("input", applyFilters);
        document.getElementById("genre-select").addEventListener("change", applyFilters);
        document.getElementById("decade-select").addEventListener("change", applyFilters);
      });
  } else {
    // Redirect to sign-in page if not logged in
    window.location.href = "signin.html";
  }
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
