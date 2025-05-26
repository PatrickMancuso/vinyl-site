const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/add-album", (req, res) => {
  const newAlbum = req.body;
  const filePath = path.join(__dirname, "public", "records.json");

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
