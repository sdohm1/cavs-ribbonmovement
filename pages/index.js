import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RibbonBoard() {
  const [imageURL, setImageURL] = useState(null);
  const [speed, setSpeed] = useState(30);
  const [direction, setDirection] = useState("left");
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

  return (
    <div className="p-6 space-y-4 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold">Ribbon Board Motion Preview</h1>
      <Input type="file" accept="image/*" onChange={handleUpload} />
      <div className="flex gap-4 items-center">
        <label>Speed:</label>
        <input
          type="range"
          min="5"
          max="60"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span>{speed}s</span>
        <label>Direction:</label>
        <select value={direction} onChange={(e) => setDirection(e.target.value)}>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div className="overflow-hidden border border-gray-600" style={{ height: 40 }}>
        <div
          className="flex animate-scroll"
          style={{
            animation: `scroll var(--scroll-speed) linear infinite`,
            animationDirection: `var(--scroll-direction)`
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
