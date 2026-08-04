import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

const CAT_GIFS = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW54eW1uYnR4Z3R5/kZt1Yab9WfT2g/giphy.gif',
  'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
  'https://media.giphy.com/media/l4KibWpBGWchSqCRy/giphy.gif',
  'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif'
];

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Loading cute cat gifs...');

  useEffect(() => {
    let loadedCount = 0;
    const totalGifs = CAT_GIFS.length;

    const updateProgress = () => {
      loadedCount++;
      const currentPct = Math.round((loadedCount / totalGifs) * 100);
      setProgress(currentPct);
      
      if (currentPct === 25) setStatusText('Fetching extra cuteness...');
      if (currentPct === 50) setStatusText('Warming up the flirty vibes...');
      if (currentPct === 75) setStatusText('Almost ready for the birthday girl!');
      if (currentPct === 100) setStatusText('Ready! 💖');
    };

    // Preload images
    CAT_GIFS.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = updateProgress;
    });

    // Fallback timer to ensure progress completes smoothly even on fast connections
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            gsap.to('#preloader-screen', {
              opacity: 0,
              scale: 0.95,
              duration: 0.6,
              ease: 'power2.inOut',
              onComplete: onComplete
            });
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      id="preloader-screen"
      className="fixed inset-0 z-50 bg-pink-100 flex flex-col items-center justify-center p-6 text-center select-none"
    >
      {/* Cute Cat Loading Gif */}
      <div className="w-32 h-32 mb-6 rounded-2xl bg-white/80 p-2 shadow-lg border-2 border-pink-200 flex items-center justify-center">
        <img
          src={CAT_GIFS[0]}
          alt="Loading Cat"
          className="w-full h-full object-contain rounded-xl animate-bounce"
        />
      </div>

      <h2 className="text-xl font-extrabold text-pink-600 mb-2">
        Hold on! Loading something special... 🐾
      </h2>
      <p className="text-xs text-pink-400 font-medium mb-6 animate-pulse">
        {statusText}
      </p>

      {/* Progress Bar Container */}
      <div className="w-64 bg-white rounded-full h-4 p-1 shadow-inner border border-pink-200 overflow-hidden relative">
        <div
          className="bg-gradient-to-r from-pink-400 to-pink-600 h-full rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-xs text-pink-500 font-bold mt-2">
        {progress}%
      </span>
    </div>
  );
};
