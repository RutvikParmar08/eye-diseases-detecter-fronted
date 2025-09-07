import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [inferenceTime, setInferenceTime] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handlePredict = async () => {
    if (!file) {
      setPrediction("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction(`Prediction: ${data.class}`);
      setConfidence(data.confidence);
      setInferenceTime(data.inference_time);
      setAccuracy(data.model_accuracy);
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error: Could not connect to backend.");
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="brand-icon">👁️</div>
            <span className="brand-text">EyeAI</span>
          </div>
          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Advanced Eye Disease Detection</h1>
          <p className="hero-subtitle">
            Leverage cutting-edge AI technology for rapid and accurate eye condition analysis
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{accuracy || "--"}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{inferenceTime || "--"}s</span>
              <span className="stat-label">Analysis Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="main-content">
        <div className="detector-container">
          <div className="upload-card">
            <div className="card-header">
              <h2 className="card-title">Upload Medical Image</h2>
              <p className="card-subtitle">Select a high-quality retinal or eye image for analysis</p>
            </div>

            <div className="upload-area">
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
                id="file-upload"
                accept="image/*"
              />
              <label htmlFor="file-upload" className={`upload-zone ${file ? 'has-image' : ''}`}>
                <div className="upload-content">
                  {preview ? (
                    <>
                      <img src={preview} alt="Uploaded preview" className="uploaded-image-preview" />
                      <span className="upload-text">Uploaded Image</span>
                      <span className="upload-hint">Click to change image</span>
                    </>
                  ) : (
                    <>
                      <div className="upload-icon">📤</div>
                      <span className="upload-text">Click to browse or drag & drop</span>
                      <span className="upload-hint">Supports JPG, PNG, WEBP formats</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            {file && (
              <div className="file-info">
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {
          // preview && (
            <div className="analysis-card">
            
              <div className="analysis-content">
                
                <div className="analysis-controls">
                  <button
                    onClick={handlePredict}
                    className={`analyze-btn ${!file ? 'disabled' : ''}`}
                    disabled={!file}
                  >
                    <span className="btn-icon">🔬</span>
                    Start AI Analysis
                  </button>
                </div>
              </div>
            </div>
          // )
          }

          {/* Results Section */}
          {prediction && (
            <div className="results-card">
              <div className="card-header">
                <h2 className="card-title">Analysis Results</h2>
              </div>
              <div className={`results-content ${prediction.includes('Error') ? 'error' :
                prediction.includes('Please upload') ? 'warning' : 'success'
                }`}>
                <div className="result-icon">
                  {prediction.includes('Error') && '❌'}
                  {prediction.includes('Please upload') && '⚠️'}
                  {!prediction.includes('Error') && !prediction.includes('Please upload') && '✅'}
                </div>
                <div className="result-text">
                  <p className="result-main">{prediction}</p>
                  {!prediction.includes('Error') && !prediction.includes('Please upload') && (
                    <p className="result-note">
                      Confidence: {confidence} | Time: {inferenceTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="disclaimer">
            <div className="disclaimer-icon">⚕️</div>
            <p className="disclaimer-text">
              <strong>Medical Disclaimer:</strong> This AI diagnostic tool is designed for educational and research purposes only.
              Results should not replace professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;