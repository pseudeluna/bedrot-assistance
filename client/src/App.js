import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [activeTab, setActiveTab] = useState("packages");
  const [packageStatus, setPackageStatus] = useState("Status"); // Defaulted to "Status"
  const [packageImage, setPackageImage] = useState("/image/default.png");
  const [tasks, setTasks] = useState([]);
  const [note, setNote] = useState("");
  const [pcUsername, setPcUsername] = useState("Loading...");
  const [darkMode, setDarkMode] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");


  // Fetch PC username
  useEffect(() => {
    fetch("/username")
      .then((res) => res.json())
      .then((data) => setPcUsername(data.username))
      .catch((err) => console.error("Error fetching username:", err));
  }, []);

  // Fetch undone tasks
  useEffect(() => {
    fetch("/undone-tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Fetch package image based on status
  useEffect(() => {
    fetch(`/package-status?status=${packageStatus}`)
      .then((res) => res.json())
      .then((data) => setPackageImage(data.image))
      .catch((err) => console.error("Error fetching package status:", err));
  }, [packageStatus]);

  const loadPlaylist = () => {
    if (!playlistUrl.trim()) return;

    let videoId = "";
    let playlistId = "";

    try {
      const url = new URL(playlistUrl);
      const params = new URLSearchParams(url.search);

      if (params.has("list")) {
        // It's a playlist
        playlistId = params.get("list");
        setEmbedUrl(`https://www.youtube.com/embed/videoseries?list=${playlistId}`);
      } else if (params.has("v")) {
        // It's a single video
        videoId = params.get("v");
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
      } else {
        alert("Invalid YouTube URL! Please enter a valid video or playlist link.");
      }
    } catch (error) {
      alert("Invalid URL format!");
    }
  };

  useEffect(() => {
    document.body.classList.toggle("alt-font", textMode);
  }, [textMode]);

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`} >
      <header>
        <img src="image/bepis.png" alt="Logo" className="logo-image" />
        <div className="logo">Your Bedrotting Assistance</div>
        <nav>
          <a href="#" id="pcUsername">
            {pcUsername}
          </a>
          <a><button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button></a>
          <a> 
            <button onClick={() => setTextMode(!textMode)}>
            {textMode ? "Normal" : "Dyslexia"}
          </button></a>
          
        </nav>
      </header>

      <div className="search-container">
        <div className="tabs">
          <button
            className={activeTab === "packages" ? "active" : ""}
            onClick={() => setActiveTab("packages")}
          >
            Delivered Package
          </button>
          <button
            className={activeTab === "tasks" ? "active" : ""}
            onClick={() => setActiveTab("tasks")}
          >
            Undone Tasks
          </button>
          <button
            className={activeTab === "notes" ? "active" : ""}
            onClick={() => setActiveTab("notes")}
          >
            Self-deprecating Notes
          </button>

          <button className={activeTab === "youtube" ? "active" : ""} onClick={() => setActiveTab("youtube")}>YouTube Player</button>
        </div>

        {activeTab === "packages" && (
          <div className="tab-content">
            <p>Please check the status first 💔</p>
            <select
              id="packageStatus"
              value={packageStatus}
              onChange={(e) => setPackageStatus(e.target.value)}
            >
              <option value="Status">Whatchuwantcheckfor</option>
              <option value="arrived">Arrived (yay!!!!)</option>
              <option value="notArrived">Not arrived (??)</option>
            </select>
            <div className="result">
              <img id="packageImage" src={packageImage} alt="Package status" />
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="tab-content">
            <table id="tasksTable">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Importance</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.task}</td>
                    <td>{task.importance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="tab-content">
            <input
              type="text"
              id="noteInput"
              placeholder="It never hurts to write another self-depreciating note...🌹🌹"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button id="saveNote" onClick={() => alert("Note saved!")}>
              Save
            </button>
            <p>
              <b>Here's the note of the day:</b>{" "}
              <span id="noteDisplay">{note || "Just give up 💔"}</span>
            </p>
          </div>
        )}
        {activeTab === "youtube" && (
          <div className="tab-content">
            <h3>Rotting session real</h3>
            <input type="text" id="noteInput" placeholder="Paste YouTube playlist URL here" 
              value={playlistUrl} onChange={(e) => setPlaylistUrl(e.target.value)}
            />
            <button id="saveNote" onClick={loadPlaylist}>Play</button>
            {embedUrl && <iframe width="80%" height="450px" src={embedUrl} frameBorder="0" allowFullScreen></iframe>}
          </div>
        )}
      </div>
      {/* Persistent YouTube Player (Stays even when switching tabs) */}
      {embedUrl && (
        <div className="persistent-player">
          <iframe width="300px" height="180px" src={embedUrl} frameBorder="0" allowFullScreen></iframe>
        </div>
      )}

      <div className="services">
        <div className="service">
          <h3>Delivered Packages</h3>
          <p>Keep track of your package that has arrived home</p>
        </div>
        <div className="service">
          <h3>Undone Tasks</h3>
          <p>Keep track of the uncompleted tasks so you can decide which one to ignore</p>
        </div>
        <div className="service">
          <h3>Self-deprecating Notes</h3>
          <p>You should never forget to add a self-deprecating note!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
