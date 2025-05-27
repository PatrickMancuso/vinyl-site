document.addEventListener("DOMContentLoaded", () => {
  const carouselView = document.getElementById("carouselView");
  const listView = document.getElementById("listView");
  const toggleViewBtn = document.getElementById("toggleViewBtn");
  const addAlbumBtn = document.getElementById("addAlbumBtn");
  const searchBar = document.getElementById("searchBar");

  let currentView = "carousel";

  toggleViewBtn.addEventListener("click", () => {
    if (currentView === "carousel") {
      carouselView.style.display = "none";
      listView.style.display = "block";
      currentView = "list";
      toggleViewBtn.textContent = "Carousel";
    } else {
      listView.style.display = "none";
      carouselView.style.display = "flex";
      currentView = "carousel";
      toggleViewBtn.textContent = "List";
    }
  });

  addAlbumBtn.addEventListener("click", () => {
    const albumTitle = prompt("Enter album title:");
    if (albumTitle) {
      addAlbum({ title: albumTitle, cover: "default-cover.jpg" });
    }
  });

  searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    document.querySelectorAll(".album").forEach((album) => {
      const title = album.getAttribute("data-title").toLowerCase();
      album.style.display = title.includes(query) ? "" : "none";
    });
  });

  function addAlbum({ title, cover }) {
    // Create carousel item
    const carouselItem = document.createElement("div");
    carouselItem.className = "album";
    carouselItem.setAttribute("data-title", title);
    carouselItem.innerHTML = `
      <img src="${cover}" alt="${title}">
      <h3>${title}</h3>
    `;
    carouselView.appendChild(carouselItem);

    // Create list item
    const listItem = document.createElement("div");
    listItem.className = "album";
    listItem.setAttribute("data-title", title);
    listItem.innerHTML = `
      <img src="${cover}" alt="${title}">
      <span>${title}</span>
    `;
    listView.appendChild(listItem);
  }

  // Example seed albums
  addAlbum({ title: "Rumours", cover: "rumours.jpg" });
  addAlbum({ title: "The Wall", cover: "thewall.jpg" });
});
