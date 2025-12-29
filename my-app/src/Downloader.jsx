import { useState } from "react";
import "./Downloader.css";

export default function Downloader() {
  const [link, setLink] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleStart = () => {
    if (!link) return alert("Paste a link");
    setShowResult(true);
  };

  return (
    <div className="downloader">
      {/* Input */}
      <div className="input-box">
        <input
          type="text"
          placeholder="Search or paste link here..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button onClick={handleStart}>Start</button>
      </div>

      {/* Result Section */}
      {showResult && (
        <div className="result">
          <div className="left">
            <img
              src="https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg"
              alt="thumbnail"
            />
          </div>

          <div className="right">
            <div className="tabs">
              <button className="active">🎵 Audio</button>
              <button>🎬 Video</button>
              <button>➕ Other</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>File type</th>
                  <th>Format</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>MP3 - 320kbps</td>
                  <td>Auto</td>
                  <td>
                    <button className="download">Download</button>
                  </td>
                </tr>
                <tr>
                  <td>MP3 - 128kbps</td>
                  <td>Auto</td>
                  <td>
                    <button className="download">Download</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
