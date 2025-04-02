const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const ANIME_FOLDER = "anime_json";

// Endpoint untuk membaca semua anime JSON dari folder
app.get("/anime-list", (req, res) => {
    fs.readdir(ANIME_FOLDER, (err, folders) => {
        if (err) return res.status(500).json({ error: "Gagal membaca folder anime" });

        let animeList = [];

        folders.forEach((folder) => {
            let folderPath = path.join(ANIME_FOLDER, folder);

            if (fs.statSync(folderPath).isDirectory()) {
                let jsonFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".json"));
                jsonFiles.forEach(file => {
                    let filePath = path.join(folderPath, file);
                    let rawData = fs.readFileSync(filePath, "utf-8");
                    let animeData = JSON.parse(rawData);
                    animeList.push(animeData);
                });
            }
        });

        res.json(animeList);
    });
});

// Hosting file statis
app.use(express.static("."));

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
