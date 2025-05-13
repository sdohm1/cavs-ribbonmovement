import { useRef, useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function RibbonBoard() {
  const [imageURL, setImageURL] = useState(null);
  const [speed, setSpeed] = useState(60); // slower default
  const [direction, setDirection] = useState("left");
  const [resolution, setResolution] = useState(4416);
  const [isExporting, setIsExporting] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const style = document.documentElement.style;
    style.setProperty("--scroll-speed", `${speed}s`);
    style.setProperty("--scroll-direction", direction === "left" ? "normal" : "reverse");
  }, [speed, direction]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = async () => {
    if (!imageURL) return alert("Upload an image first!");
    setIsExporting(true);

    try {
      const response = await fetch("https://ribbon-export-api.onrender.com/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: imageURL,
          width: resolution,
          height: 40,
          duration: 15,
          filename: "ribbon-output.mp4",
        }),
      });

      if (!response.ok) {
        alert("Export failed. Try again.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ribbon-output.mp4";
      a.click();
    } catch (err) {
      console.error("Export error:", err);
      alert("An error occurred during export.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen text-white font-sans">
      <div className="flex items-center justify-center">
        <img src="/ribbon_logo.png" alt="Logo" className="h-12" />
      </div>

      <h1 className="text-3xl font-bold text-center">Ribbon Board Motion Preview</h1>

      <div className="space-y-4">
        <Input type="file" accept="image/*" onChange={handleUpload} />

        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <label>Speed:</label>
            <input
              type="range"
              min="5"
              max="120"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="accent-blue-500"
            />
            <span>{speed}s</span>
          </div>

          <div className="flex items-center gap-2">
            <label>Direction:</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="bg-gray-800 border border-gray-600 px-2 py-1 rounded"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label>Ribbon:</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value))}
              className="bg-gray-800 border border-gray-600 px-2 py-1 rounded"
            >
              <option value={4416}>Lower (4416x40)</option>
              <option value={10104}>Upper (10104x40)</option>
              <option value={20208}>Upper Full Wrap (20208x40)</option>
            </select>
          </div>

          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Download .mp4"}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border border-gray-600 mx-auto" style={{ height: 40, width: resolution }}>
        <div
          className="flex animate-scroll"
          style={{
            animation: `scroll var(--scroll-speed) linear infinite`,
            animationDirection: `var(--scroll-direction)`,
          }}
        >
          {imageURL && (
            <>
              <img ref={imageRef} src={imageURL} alt="ribbon" height={40} style={{ height: 40 }} />
              <img src={imageURL} alt="ribbon-duplicate" height={40} style={{ height: 40 }} />
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
