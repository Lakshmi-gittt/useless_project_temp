import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/jgSOMU3CZ/";

function App() {
  const [prediction, setPrediction] = useState(null);
  const [model, setModel] = useState(null);
  const [maxPred, setMaxPred] = useState("");
  const [emoji, setEmoji] = useState("");
  const imageRef = useRef();

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tmImage.load(
        MODEL_URL + "model.json",
        MODEL_URL + "metadata.json"
      );
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (imageRef.current) {
        imageRef.current.src = img.src;
        const predictions = await model.predict(img);
        setPrediction(predictions);

        const highest = predictions.reduce((a, b) =>
          a.probability > b.probability ? a : b
        );
        setMaxPred(highest.className);

        const roastEmojis = {
          "Cool Breeze": "❄️😎",
          "Slightly Toasted": "🌤️😅",
          "Mild Burn": "🔥🙂",
          "Roasted": "🌞🔥😆",
          "SunHit Supreme": "☀️🔥😂"
        };

        setEmoji(roastEmojis[highest.className] || "🔥");
      }
    };
  };

  return (
    <>
      {/* Floating Suns Background */}
      <div>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="sun"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              animationDuration: `${8 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="app-container d-flex flex-column align-items-center justify-content-center">
        <h1 className="heading text-center">☀️ SunHit Selfie Roast Detector</h1>

        <div className="upload-box p-4 mt-4 mb-3 text-center">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageUpload}
          />
        </div>

        <div>
          <img
            ref={imageRef}
            alt="Uploaded preview"
            className="preview-img mt-3"
          />
        </div>

        {maxPred && (
          <div className="mt-4 result-box">
            <h3 className="text-warning">🔥 Roast Level: {maxPred}</h3>
            <div className="emoji-display">{emoji}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
