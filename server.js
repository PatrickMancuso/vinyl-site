const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("public"));

const filePath = path.join(__dirname, "public", "records.json");

// --- Add Album ---
app.post("/add-album", (req, res) => {
  const newAlbum = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Read error");

    let albums = [];
    try {
      albums = JSON.parse(data);
    } catch {
      return res.status(500).send("Invalid JSON");
    }

    albums.push(newAlbum);

    fs.writeFile(filePath, JSON.stringify(albums, null, 2), (err) => {
      if (err) return res.status(500).send("Write error");
      res.status(200).send("Album saved!");
    });
  });
});

// --- Update Album ---
app.put("/api/records/:id", (req, res) => {
  const albumId = req.params.id;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Read error");

    let albums;
    try {
      albums = JSON.parse(data);
    } catch {
      return res.status(500).send("Invalid JSON");
    }

    const index = albums.findIndex(album => String(album.id) === String(albumId));
    if (index === -1) {
      return res.status(404).send("Album not found");
    }

    // Merge updates into existing album
    albums[index] = { ...albums[index], ...req.body };

    fs.writeFile(filePath, JSON.stringify(albums, null, 2), (err) => {
      if (err) return res.status(500).send("Write error");
      res.json(albums[index]);
    });
  });
});

// --- Delete Album ---
app.delete("/delete-album/:id", (req, res) => {
  const albumId = req.params.id;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Read error");

    let albums;
    try {
      albums = JSON.parse(data);
    } catch {
      return res.status(500).send("Invalid JSON");
    }

    const updatedAlbums = albums.filter(album => album.id !== albumId);

    if (updatedAlbums.length === albums.length) {
      return res.status(404).send("Album not found");
    }

    fs.writeFile(filePath, JSON.stringify(updatedAlbums, null, 2), (err) => {
      if (err) return res.status(500).send("Write error");
      res.status(200).send("Album deleted");
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
