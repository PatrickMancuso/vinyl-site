document.addEventListener("DOMContentLoaded", () => {
  fetch('records.json')
    .then(res => res.json())
    .then(data => {
      const album = data[Math.floor(Math.random() * data.length)];

      document.getElementById('album-title').textContent = album.title;
      document.getElementById('album-artist').textContent = album.artist;
      document.getElementById('album-cover').src = album.cover;

      const spotify = document.getElementById('spotify-embed');
      if (album.spotify_url) {
        spotify.src = album.spotify_url;
      } else {
        spotify.style.display = 'none';
      }

      const apiKey = "e530c016b028fa384b92183344f7526e";
      const artistName = album.api_artist_name || album.artist;

      fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`)
        .then(res => res.json())
        .then(data => {
          const bio = data.artist?.bio?.summary || '';
          const tags = data.artist?.tags?.tag.map(t => t.name).join(', ') || '';
          document.getElementById('artist-info').innerHTML = `
            <h4>About ${album.artist}</h4>
            <p>${bio}</p>
            <p><strong>Tags:</strong> ${tags}</p>
          `;
        })
        .catch(() => {
          document.getElementById('artist-info').innerHTML = `<p>Could not load artist info.</p>`;
        });
    })
    .catch(err => {
      console.error("Error loading album:", err);
    });
});
