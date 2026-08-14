import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Box } from "@mui/material";

/* ============================================
   GLOBAL LOADING CONTEXT
   Manages loading states across the app
   ============================================ */

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingQueue = useRef([]);
  const timeoutRef = useRef(null);

  const startLoading = useCallback((message = "Loading...") => {
    setIsLoading(true);
    setLoadingMessage(message);
    setLoadingProgress(0);
    
    // Animate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90; // Cap at 90% until actual completion
      setLoadingProgress(progress);
    }, 200);

    timeoutRef.current = { interval, startTime: Date.now() };
  }, []);

  const stopLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current.interval);
      setLoadingProgress(100);
    }
    
    setTimeout(() => {
      setIsLoading(false);
      setLoadingMessage("");
      setLoadingProgress(0);
      timeoutRef.current = null;
    }, 200);
  }, []);

  const queueLoading = useCallback((fn) => {
    loadingQueue.current.push(fn);
    if (loadingQueue.current.length === 1) {
      startLoading();
    }
  }, [startLoading]);

  const completeQueueItem = useCallback(async (result) => {
    const currentFn = loadingQueue.current.shift();
    if (currentFn) {
      try {
        await currentFn(result);
      } catch (error) {
        console.error("Queue item error:", error);
      }
    }
    
    if (loadingQueue.current.length === 0) {
      stopLoading();
    }
  }, [stopLoading]);

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingMessage,
      loadingProgress,
      startLoading,
      stopLoading,
      queueLoading,
      completeQueueItem
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

/* ============================================
   CUSTOM HOOK FOR API CALLS WITH LOADING
   ============================================ */

export function useApiWithLoading() {
  const { startLoading, stopLoading } = useLoading();

  const apiCall = useCallback(async (apiFn, options = {}) => {
    const { 
      loadingMessage = "Loading...",
      showError = true,
      errorCallback = null
    } = options;

    startLoading(loadingMessage);
    
    try {
      const result = await apiFn();
      stopLoading();
      return { success: true, data: result };
    } catch (error) {
      stopLoading();
      if (showError) {
        console.error("API Error:", error);
      }
      if (errorCallback) {
        errorCallback(error);
      }
      return { success: false, error };
    }
  }, [startLoading, stopLoading]);

  return apiCall;
}

/* ============================================
   DEBOUNCE HOOK FOR SMOOTH TYPING
   ============================================ */

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/* ============================================
   LAZY IMAGE LOADER COMPONENT
   ============================================ */

export function LazyImage({ 
  src, 
  alt, 
  placeholder, 
  style, 
  className,
  onLoad,
  onError,
  ...props 
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setLoaded(true);
              onLoad?.();
            };
            img.onerror = () => {
              setError(true);
              onError?.();
            };
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, onLoad, onError]);

  return (
    <Box
      ref={imgRef}
      className={className}
      sx={{
        ...style,
        background: !loaded && !error ? "#f0f0f0" : undefined,
        transition: "opacity 0.3s ease",
        opacity: loaded ? 1 : 0,
        minHeight: placeholder ? 100 : undefined
      }}
      {...props}
    >
      {!loaded && !error && placeholder}
      {error && (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          height: "100%",
          background: "#f5f5f5",
          color: "#9ca3af"
        }}>
          🖼️
        </Box>
      )}
      {loaded && (
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover" 
          }} 
        />
      )}
    </Box>
  );
}

/* ============================================
   PRELOADER COMPONENT
   ============================================ */

export function PagePreloader() {
  const { isLoading, loadingMessage, loadingProgress } = useLoading();

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        transition: "opacity 0.3s ease"
      }}
    >
      <Box
        component="img"
        src="/Fixora.png"
        alt="Loading"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
        sx={{ height: 50, mb: 4 }}
      />
      <Box
        sx={{
          width: 240,
          height: 6,
          background: "#e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
          mb: 2
        }}
      >
        <Box
          sx={{
            width: `${loadingProgress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
            borderRadius: 3,
            transition: "width 0.2s ease"
          }}
        />
      </Box>
      <Box sx={{ fontSize: 12, color: "#9ca3af" }}>
        {loadingMessage}
      </Box>
    </Box>
  );
}

export default LoadingProvider;
