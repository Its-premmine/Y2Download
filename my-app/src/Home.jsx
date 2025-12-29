import { useEffect, useState } from "react";
import "./Home.css";

// 🔥 Clean YouTube URL (playlist safe)
const cleanYouTubeUrl = (url) => {
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    return v ? `https://www.youtube.com/watch?v=${v}` : url;
  } catch {
    return url;
  }
};

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFormats, setVideoFormats] = useState([]);
  const [audioFormat, setAudioFormat] = useState(null);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!videoUrl) return;
    if (!videoUrl.includes("youtube")) return;

    const fixed = cleanYouTubeUrl(videoUrl);
    if (fixed !== videoUrl) setVideoUrl(fixed);

    const t = setTimeout(fetchInfo, 700);
    return () => clearTimeout(t);
  }, [videoUrl]);

  const fetchInfo = async () => {
    setLoading(true);
    setError("");
    setVideoFormats([]);
    setAudioFormat(null);

    try {
      const res = await fetch("http://localhost:5000/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanYouTubeUrl(videoUrl) }),
      });

      const data = await res.json();

      if (!data.formats || data.formats.length === 0) {
        setError("No download options found");
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setThumbnail(data.thumbnail);

      // 🎬 VIDEO — allow adaptive streams (IMPORTANT FIX)
      const videos = data.formats
        .filter(
          f =>
            (f.ext === "mp4" || f.ext === "webm") &&
            f.vcodec !== "none"
        )
        .sort((a, b) => (b.filesize || 0) - (a.filesize || 0))
        .slice(0, 3);

      // 🎵 AUDIO — always available
      const audio = data.formats.find(
        f => f.acodec !== "none" && f.vcodec === "none"
      );

      setVideoFormats(videos);
      setAudioFormat(audio);
    } catch {
      setError("Server not running or API error");
    }

    setLoading(false);
  };

  return (
    <div className="home-wrapper">
      <div className="home-card">
        <h1 className="home-title">Video Downloader</h1>
        <p className="home-subtitle">
          Download videos quickly in multiple formats
        </p>

        <div className="input-area">
          <input
            type="text"
            placeholder="Paste YouTube link here..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button disabled>Download</button>
        </div>

        {loading && <p className="info">Fetching video info…</p>}
        {error && <p className="error">{error}</p>}

        {title && (
          <div className="video-header">
            <img src={thumbnail} alt="thumb" />
            <h3>{title}</h3>
          </div>
        )}

        {(videoFormats.length > 0 || audioFormat) && (
          <div className="formats">
            <h4>🎬 Video</h4>
            {videoFormats.map((v, i) => (
              <div className="format-row" key={i}>
                <span>{v.quality}</span>
                <a href={v.download} className="download-btn" download>
                  ⬇ Download
                </a>
              </div>
            ))}

            {audioFormat && (
              <>
                <h4>🎵 Audio</h4>
                <div className="format-row">
                  <span>MP3 – 320kbps</span>
                  <a href={audioFormat.download} className="download-btn" download>
                    ⬇ Download
                  </a>
                </div>
              </>
            )}
          </div>
        )}

        <p className="home-note">
          By continuing, you agree to our <span>Terms & Privacy</span>
        </p>
      </div>
    </div>
  );
}
