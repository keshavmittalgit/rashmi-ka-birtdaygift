import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export const BirthdayApp: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState(1);
  const [noBtnPos, setNoBtnPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isWon, setIsWon] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const preloaderRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const giftModalRef = useRef<HTMLDivElement>(null);


  // Preload all GIF images during the loader phase & sync progress bar
  useEffect(() => {
    const gifsToPreload = [
      '/Let%20Me%20Think%20What%20GIF.gif',
      '/cool-cat-cool.gif',
      '/cute-cat-cat-cute.gif',
      '/attention-attention-taps.gif',
      '/googly-eyes-kitty-eyes.gif',
      '/love-you-loving-cat.gif',
      '/peach-goma.gif'
    ];

    let loadedCount = 0;
    const totalGifs = gifsToPreload.length;

    gifsToPreload.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount += 1;
      };
      img.src = src;
    });

    const timer = setInterval(() => {
      setProgress((prev) => {
        const realPercentage = Math.floor((loadedCount / totalGifs) * 100);
        const next = prev + 2;

        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Hold at 90% if asset preloading is still finishing on slow mobile connections
        if (next > 90 && realPercentage < 100) {
          return 90;
        }
        return next;
      });
    }, 35);

    return () => clearInterval(timer);
  }, []);



  // Funny, cute & flirty preloader exit animation
  useEffect(() => {
    if (progress >= 100 && preloaderRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setIsLoaded(true)
      });

      tl.to(preloaderRef.current, {
        scale: 1.15,
        rotate: -10,
        duration: 0.22,
        ease: 'back.out(2)'
      })
      .to(preloaderRef.current, {
        rotate: 10,
        scale: 1.2,
        duration: 0.2,
        ease: 'power1.inOut'
      })
      .to(preloaderRef.current, {
        rotate: 360,
        scale: 1.25,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)'
      })
      .to(preloaderRef.current, {
        y: -150,
        scale: 0.2,
        opacity: 0,
        duration: 0.45,
        ease: 'back.in(2)'
      });
    }
  }, [progress]);

  // Main content reveal
  useEffect(() => {
    if (isLoaded && mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { scale: 0.8, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }
  }, [isLoaded]);

  // Bouncy, flirty GSAP pop-in animation for Final Gift Card
  useEffect(() => {
    if (showGiftModal && giftModalRef.current) {
      gsap.fromTo(
        giftModalRef.current,
        { scale: 0.2, rotate: -12, opacity: 0, y: 60 },
        { scale: 1, rotate: 0, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(2)' }
      );
    }
  }, [showGiftModal]);


  // Dodge No button logic
  const dodgeNoButton = () => {
    const x = Math.random() * 220 - 110;
    const y = Math.random() * 160 - 80;
    setNoBtnPos({ x, y });
  };

  const handleNoClick = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      dodgeNoButton();
    }
  };

  const handleYesClick = () => {
    setIsWon(true);
    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#000000', '#c5b0f4', '#dceeb1', '#ff3d8b']
      });
    }
  };

  const getQuestion = () => {
    switch (step) {
      case 1:
        return 'Do you like me?';
      case 2:
        return 'So you love me?';
      case 3:
        return 'Are you sure?';
      case 4:
      default:
        return 'Nahi matlab... sach me?!';
    }
  };

  const getSubText = () => {
    switch (step) {
      case 3:
        return 'Karti hai toh haan bol de!';
      case 4:
        return 'nahhi';
      case 1:
      case 2:
      default:
        return '';
    }
  };


  const getCardGif = () => {
    switch (step) {
      case 1:
        return '/cool-cat-cool.gif';
      case 2:
        return '/cute-cat-cat-cute.gif';
      case 3:
        return '/attention-attention-taps.gif';
      case 4:
      default:
        return '/googly-eyes-kitty-eyes.gif';
    }
  };

  const getCardBg = () => {
    switch (step) {
      case 1:
        return '#f4ecd6'; // Figma block-cream token
      case 2:
        return '#efd4d4'; // Figma block-pink token
      case 3:
        return '#c5b0f4'; // Figma block-lilac token (pastel lavender)
      case 4:
      default:
        return '#ffd3b6'; // Figma pastel orange token
    }
  };

  const getYesButtonLabel = () => {
    switch (step) {
      case 1:
        return 'Yes baby';
      case 2:
      case 3:
      case 4:
      default:
        return 'Haan';
    }
  };

  const getNoButtonLabel = () => {
    return 'Nahi';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans overflow-hidden">
      {!isLoaded ? (
        /* Preloader Screen with Cat GIF & Slider */
        <div
          ref={preloaderRef}
          className="w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center gap-6"
        >
          <div className="w-full aspect-square flex items-center justify-center relative overflow-hidden rounded-2xl">
            <img
              src="/Let%20Me%20Think%20What%20GIF.gif"
              alt="Let Me Think What GIF"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>

          <div className="w-full flex flex-col items-center gap-2">
            <div className="w-full bg-gray-100 rounded-full h-3 p-0.5 overflow-hidden border border-gray-200 shadow-inner">
              <div
                className="bg-black h-full rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-xs font-mono text-gray-500 font-semibold px-1">
              <span>Thinking...</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      ) : (
        /* Figma Color-Block Section (Dynamic block-cream on step 1, block-pink on step 2, block-lilac on step 3+) */
        <main
          ref={mainContentRef}
          style={{ backgroundColor: getCardBg() }}
          className="w-full max-w-md min-h-[500px] rounded-3xl p-6 sm:p-10 border border-[#e6e6e6] shadow-sm flex flex-col items-center justify-between text-center transition-all duration-500 relative"
        >
          {/* Top Hero Feature Tile (surface-soft with rounded-2xl) */}
          <div className="w-48 h-48 sm:w-60 sm:h-60 mx-auto rounded-2xl overflow-hidden border border-[#e6e6e6] shadow-sm bg-white p-2 flex items-center justify-center shrink-0">
            <img
              key={step}
              src={getCardGif()}
              alt="Step Cat GIF"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Let%20Me%20Think%20What%20GIF.gif';
              }}
            />
          </div>

          {/* Text Area (Fixed height container so card height never changes between steps) */}
          <div className="flex flex-col items-center justify-center min-h-[96px] w-full my-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#000000]">
              {getQuestion()}
            </h1>

            {getSubText() && (
              <p className="text-base sm:text-lg text-[#000000]/70 mt-2 max-w-sm font-medium leading-relaxed">
                {getSubText()}
              </p>
            )}
          </div>

          {/* Figma Button Pair: button-primary (black pill) & button-secondary (white pill) */}
          <div className="flex justify-center items-center gap-4 relative min-h-[64px] w-full">
            <button
              onClick={handleYesClick}
              className="bg-[#000000] hover:bg-[#222222] text-[#ffffff] text-lg font-medium py-3.5 px-10 rounded-full shadow-md transform active:scale-95 transition-all z-20 cursor-pointer"
            >
              {getYesButtonLabel()}
            </button>

            <button
              onClick={handleNoClick}
              onMouseEnter={step >= 4 ? dodgeNoButton : undefined}
              onTouchStart={step >= 4 ? dodgeNoButton : undefined}
              style={
                step >= 4
                  ? {
                      transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)`
                    }
                  : undefined
              }
              className="bg-white hover:bg-gray-50 text-[#000000] border border-[#e6e6e6] text-lg font-medium py-3.5 px-10 rounded-full shadow-sm transition-all z-10 cursor-pointer"
            >
              {getNoButtonLabel()}
            </button>
          </div>
        </main>
      )}

      {/* Win / Celebration Modal */}
      {isWon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white p-6 sm:p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl border border-gray-200 flex flex-col items-center gap-6">
            <div className="w-44 h-44 mx-auto rounded-2xl overflow-hidden border border-[#e6e6e6] shadow-sm bg-white p-2 flex items-center justify-center shrink-0">
              <img
                src="/love-you-loving-cat.gif"
                alt="Love You Loving Cat"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="flex flex-col items-center gap-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#000000]">
                I knew it!
              </h1>
              <p className="text-lg sm:text-xl font-bold text-black/80">
                Happy Birthday Rashmi
              </p>
            </div>

            <button
              onClick={() => {
                setIsWon(false);
                setShowGiftModal(true);
              }}
              className="bg-black hover:bg-gray-800 text-white text-base font-medium py-3.5 px-8 rounded-full shadow-md transition-all active:scale-95 cursor-pointer w-full"
            >
              here is your gift
            </button>
          </div>
        </div>
      )}

      {/* Final Gift Modal (Bigger, animated pop-in card with zero confetti) */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50">
          <div
            ref={giftModalRef}
            className="bg-[#f4ecd6] p-8 sm:p-12 rounded-3xl text-center max-w-md sm:max-w-lg w-full shadow-2xl border border-[#e6e6e6] flex flex-col items-center gap-8"
          >
            <div className="w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-2xl overflow-hidden border border-[#e6e6e6] shadow-sm bg-white p-2.5 flex items-center justify-center shrink-0">
              <img
                src="/peach-goma.gif"
                alt="Peach Goma GIF"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#000000] leading-snug">
              Phele momos khila fir gift dunga
            </h1>
          </div>
        </div>
      )}





    </div>
  );
};
