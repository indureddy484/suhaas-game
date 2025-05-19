import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import "./VideoGame.css";

const allVideos = [
  { id: "vid1", src: "/videos/fst.mp4" },
  { id: "vid2", src: "/videos/scnd.mp4" },
  { id: "vid3", src: "/videos/thrd.mp4" },
  { id: "vid4", src: "/videos/frth.mp4" },
];

const successSound = new Audio("/sounds/success-1-6297 - Copy.mp3");
const failSound = new Audio("/sounds/fail-2-277575.mp3");

const VideoGame = () => {
  const [question, setQuestion] = useState([]);
  const [target, setTarget] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [correctOrder, setCorrectOrder] = useState([]);
  const [level, setLevel] = useState(() => {
  const storedLevel = localStorage.getItem("suhaas-level");
  return storedLevel ? parseInt(storedLevel) : 1;
});


  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = () => {
    const shuffled = [...allVideos].sort(() => 0.5 - Math.random());
    const count = 4 + Math.floor(Math.random() * 2);
    const selected = shuffled.slice(0, count);
    setQuestion(selected);
    setCorrectOrder(selected.map((v) => v.id));
    setTarget(new Array(selected.length).fill(""));
    setSelectedVideo(null);
    setMessage("");
   setLevel((prev) => {
  const newLevel = prev + 1;
  localStorage.setItem("suhaas-level", newLevel);
  return newLevel;
});
  };

  const handleSlotClick = (index) => {
    if (!selectedVideo) return;
    if (target.includes(selectedVideo)) return;

    const updated = [...target];
    updated[index] = selectedVideo;
    setTarget(updated);
    setSelectedVideo(null);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCheck = () => {
    if (target.includes("")) {
      setMessage("🚫 Please fill all slots.");
      return;
    }

    if (target.join() === correctOrder.join()) {
      successSound.play();
      triggerConfetti(); // 🎉 Trigger confetti
      setMessage(`🌟 Great Job Suhaas! Level ${level} Complete!`);
      setTimeout(loadNewQuestion, 3000);
    } else {
      failSound.play();
      setMessage("❌ Try Again!");
    }
  };

  const getVideoById = (id) => question.find((v) => v.id === id)?.src;
  const resetLevel = () => {
  localStorage.setItem("suhaas-level", 1);
  setLevel(1);
  setMessage("🔁 Level reset to 1.");
};

  return (
    <div className="game-container">
      <h3 className="level-display">Level {level}</h3>
      <h2>🎥 Tap a video, then tap a box to place it</h2>
      <div className="avatar-container">
  <img src="/images/ChatGPT Image May 19, 2025, 02_23_06 PM.png" alt="Suhaas" className="avatar" />
  <h3 className="level-display">Level {level}</h3>
</div>

      <div className="video-row">
        {question.map((video) => (
          <div
            key={video.id}
            className={`video-box ${selectedVideo === video.id ? "selected" : ""}`}
            onClick={() => setSelectedVideo(video.id)}
          >
            <video
              src={video.src}
              width="160"
              height="90"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        ))}
      </div>

      <div className="drop-area">
        {target.map((id, index) => (
          <div key={index} className="drop-slot" onClick={() => handleSlotClick(index)}>
            {id ? (
              <video
                src={getVideoById(id)}
                width="120"
                height="70"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div className="placeholder">Click to place</div>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleCheck} className="check-btn">
        Check Answer
      </button>
      <button onClick={resetLevel} className="reset-btn">
  🔄 Reset Level
</button>

      <p className="message">{message}</p>
    </div>
  );
};

export default VideoGame;
