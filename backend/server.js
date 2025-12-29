const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/info", (req, res) => {
  let { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  // 🔒 Clean playlist / mix / radio params
  if (url.includes("&")) {
    url = url.split("&")[0];
  }

  const cmd = `python -m yt_dlp -j "${url}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: "yt-dlp failed" });
    }

    try {
      const data = JSON.parse(stdout);

      if (!data.formats) {
        return res.json({ formats: [] });
      }

      const formats = data.formats
        .filter(f => f.url)
        .map(f => ({
          ext: f.ext,
          quality:
            f.format_note ||
            f.resolution ||
            f.format ||
            f.ext,
          vcodec: f.vcodec,
          acodec: f.acodec,
          filesize: f.filesize || f.filesize_approx || 0,
          download: f.url,
        }));

      res.json({
        title: data.title,
        thumbnail: data.thumbnail,
        formats,
      });
    } catch (e) {
      res.status(500).json({ error: "Parse error" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
