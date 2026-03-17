const API_KEY = "e530c016b028fa384b92183344f7526e"; 

async function getJSON(url) {
  const res = await fetch(url);
  return res.json();
}

async function loadRec() {
  const container = document.getElementById("rec-container");
  const progressBar = document.getElementById("progress");
  progressBar.style.width = "0%";

  function updateProgress(percent) {
    progressBar.style.width = percent + "%";
  }

  // Step 1: Load collection
  const records = await getJSON("records.json");

  // Count albums per artist
  const artistCount = {};
  records.forEach(r => {
    const artist = r.api_artist_name || r.artist;
    artistCount[artist] = (artistCount[artist] || 0) + 1;
  });

  // Get all artists and random picks
  const allArtists = Object.keys(artistCount);
  const shuffledArtists = allArtists.sort(() => 0.5 - Math.random());
  const randomArtists = shuffledArtists.slice(0, 3);

  const ownedArtists = new Set(records.map(r => r.api_artist_name || r.artist));

  // Count tags
  const tagCount = {};
  records.forEach(r => {
    if (!r.tags) return;
    r.tags.split(",").forEach(tag => {
      tag = tag.trim().toLowerCase();
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  const allTags = Object.keys(tagCount);
  const shuffledTags = allTags.sort(() => 0.5 - Math.random());
  const randomTags = shuffledTags.slice(0, 2);

  // Prepare progress tracking
  const totalAlbums = (randomArtists.length * 18) + (randomTags.length * 18); // max possible
  let loadedAlbums = 0;

  // ------------------------
  // Artist-based recommendations
  // ------------------------
  const seenArtists = new Set();

  for (const artist of randomArtists) {
    const likedAlbum = records.find(r => (r.api_artist_name || r.artist) === artist);
    const likedAlbumName = likedAlbum && likedAlbum.album ? likedAlbum.album : "an album";

    const section = document.createElement("section");
    section.innerHTML = `<h3>Since you liked ${likedAlbumName} by <strong>${artist}</strong>...</h3>`;

    const grid = document.createElement("div");
    grid.className = "album-grid";

    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json&limit=18`;
      const data = await getJSON(url);

      if (data.similarartists && data.similarartists.artist) {
        for (const sim of data.similarartists.artist) {
          const simArtist = sim.name;
          if (ownedArtists.has(simArtist) || seenArtists.has(simArtist)) continue;

          const albumUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(simArtist)}&api_key=${API_KEY}&format=json&limit=18`;
          const albumData = await getJSON(albumUrl);

          if (albumData.topalbums && albumData.topalbums.album.length > 0) {
            const album = albumData.topalbums.album[0];
            const img = album.image?.[2]?.['#text'] || "img/placeholder.webp";

            const albumLink = album.url || `https://www.last.fm/music/${encodeURIComponent(simArtist)}/+albums`;

            const card = document.createElement("a");
            card.className = "album-card";
            card.href = albumLink;
            card.target = "_blank";
            card.rel = "noopener";
            card.innerHTML = `
              <img src="${img}" alt="${album.name}">
              <div><strong>${album.name}</strong><br>${simArtist}</div>
            `;
            grid.appendChild(card);

            // Update progress
            loadedAlbums++;
            updateProgress(Math.round((loadedAlbums / totalAlbums) * 100));

            seenArtists.add(simArtist);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching recs for", artist, err);
    }

    if (!grid.hasChildNodes()) {
      grid.innerHTML = "<p>No similar artist recommendations found.</p>";
    }

    section.appendChild(grid);
    container.appendChild(section);
  }

  // ------------------------
  // Tag-based recommendations
  // ------------------------
  for (const tag of randomTags) {
    const section = document.createElement("section");
    section.innerHTML = `<h3>Because you listen to <strong>${tag}</strong>...</h3>`;

    const grid = document.createElement("div");
    grid.className = "album-grid";

    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${encodeURIComponent(tag)}&api_key=${API_KEY}&format=json&limit=18`;
      const data = await getJSON(url);

      if (data.albums && data.albums.album) {
        const seenAlbums = new Set();

        for (const album of data.albums.album) {
          const albumKey = album.name.toLowerCase() + "|" + album.artist.name.toLowerCase();
          if (seenAlbums.has(albumKey)) continue;
          seenAlbums.add(albumKey);

          const img = album.image?.[2]?.['#text'] || "img/placeholder.webp";
          const albumLink = album.url || `https://www.last.fm/music/${encodeURIComponent(album.artist.name)}/+albums`;

          const card = document.createElement("a");
          card.className = "album-card";
          card.href = albumLink;
          card.target = "_blank";
          card.rel = "noopener";
          card.innerHTML = `
            <img src="${img}" alt="${album.name}">
            <div><strong>${album.name}</strong><br>${album.artist.name}</div>
          `;
          grid.appendChild(card);


          // Update progress
          loadedAlbums++;
          updateProgress(Math.round((loadedAlbums / totalAlbums) * 100));
        }
      }
    } catch (err) {
      console.error("Error fetching tag recs for", tag, err);
    }

    if (!grid.hasChildNodes()) {
      grid.innerHTML = "<p>No recommendations found for this tag.</p>";
    }

    section.appendChild(grid);
    container.appendChild(section);
  }

  // Ensure progress bar reaches 100% then hide
  progressBar.style.width = "100%";
  setTimeout(() => {
    document.getElementById("loading-bar").style.display = "none";
  }, 400);
}

loadRec();
