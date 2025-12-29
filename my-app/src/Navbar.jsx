import "./Navbar.css";
import logo from "./Download1.jpg"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={logo}
          alt="Logo"
          className="logo"
        />
        <span className="brand">Y2Dow</span>
      </div>

      <ul className="navbar-menu">
        <li>YouTube Downloader</li>
        <li>YouTube to MP4 Converter</li>
        <li>YouTube to MP3 Converter</li>
      </ul>

      <div className="navbar-right">
        <select>
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
    </nav>
  );
}
