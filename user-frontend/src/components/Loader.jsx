import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const targetDuration = 1800;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / targetDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setOpacity(0);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 400);
        }, 200);
      }
    };
    
    const timer = setTimeout(() => setShowFallback(true), 500);
    requestAnimationFrame(animate);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  const getLoadingText = () => {
    if (progress < 25) return "Loading services...";
    if (progress < 50) return "Preparing your experience...";
    if (progress < 75) return "Almost ready...";
    return "Starting...";
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 25%, #cfd9df 50%, #a1ffce 75%, #faffd1 100%)",
        opacity: opacity,
        transition: "opacity 0.4s ease",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(255, 182, 193, 0.4), transparent)",
          top: -100,
          left: -100,
          filter: "blur(100px)",
          zIndex: 0
        }}
      />
      
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "fadeInScale 0.6s ease-out",
          "@keyframes fadeInScale": {
            "0%": { opacity: 0, transform: "scale(0.9)" },
            "100%": { opacity: 1, transform: "scale(1)" }
          }
        }}
      >
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            p: 4,
            textAlign: "center"
          }}
        >
          <Box
            component="img"
            src="/Fixora.png"
            alt="Fixora"
            onLoad={() => setShowFallback(false)}
            onError={() => setShowFallback(true)}
            sx={{
              height: 70,
              mb: 2,
              display: showFallback ? "none" : "block"
            }}
          />
          
          {showFallback && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)"
                }}
              >
                <Typography
                  sx={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "#4f46e5",
                    letterSpacing: "-1px"
                  }}
                >
                  F
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#1a1a2e",
                  letterSpacing: "2px"
                }}
              >
                FIXORA
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: 300,
            height: 4,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: 10,
            overflow: "hidden",
            mt: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #a6c1ee 0%, #a1ffce 100%)",
              borderRadius: 10,
              transition: "width 0.08s linear",
              boxShadow: "0 0 20px rgba(161, 255, 206, 0.5)"
            }}
          />
        </Box>

        <Typography
          sx={{
            mt: 2.5,
            fontSize: 13,
            color: "#4a5568",
            letterSpacing: "0.3px",
            fontWeight: 500
          }}
        >
          {getLoadingText()}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center"
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            color: "#718096",
            letterSpacing: "0.5px"
          }}
        >
          Your trusted home services partner
        </Typography>
      </Box>
    </Box>
  );
}
