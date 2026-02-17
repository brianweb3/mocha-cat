import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { active, progress } = useProgress();

  return active ? (
    <Html center>
      <div
        style={{
          width: "400px",
          padding: "30px",
          background: "#ffffff",
          border: "4px solid #000000",
          borderRadius: "0",
          textAlign: "center",
          fontFamily: "DynaPuff, serif",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#000000",
            marginBottom: "20px",
          }}
        >
          LOADING...
        </div>
        <div
          style={{
            width: "100%",
            height: "30px",
            background: "#f0f0f0",
            border: "2px solid #000000",
            borderRadius: "0",
            overflow: "hidden",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#ff6600",
              transition: "width 0.39s ease-out",
              borderRadius: "0",
            }}
          />
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#ff6600",
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </Html>
  ) : null;
}
