import React, { useEffect, useRef, useState, useCallback } from "react";
import "./carousel.css";

export default function Carousel({
  slides = [], // array of { id, src, alt } or JSX nodes
  autoPlayInterval = 1000,
  startPlaying = true,
  height = "420px",
  className = "",
  showDots = true,
  showArrows = true,
  showPlayPause = true,
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(startPlaying);
  const slidesCount = slides.length;
  const timerRef = useRef(null);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + slidesCount) % slidesCount);
  }, [slidesCount]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slidesCount);
  }, [slidesCount]);

  // autoplay
  useEffect(() => {
    if (!playing || slidesCount <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slidesCount);
    }, autoPlayInterval);
    return () => clearInterval(timerRef.current);
  }, [playing, slidesCount, autoPlayInterval]);

  // pause when user hovers carousel
  const onMouseEnter = () => setPlaying(false);
  const onMouseLeave = () => setPlaying(startPlaying);

  const goTo = (i) => setIndex(i);

  return (
    <div
      className={`carousel-root ${className}`}
      style={{ height }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Slides viewport */}
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{
            width: `${slidesCount * 100}%`,
            transform: `translateX(-${(index / slidesCount) * 100}%)`,
          }}
        >
          {slides.map((s, i) => (
            <div
              key={s.id ?? i}
              className="carousel-slide"
              style={{ width: `${100 / slidesCount}%`, height }}
            >
              {/* allow slide to be an <img src=.../> or a JSX node */}
              {typeof s === "string" ? (
                <img src={s} alt={`slide-${i}`} draggable="false" />
              ) : s && s.src ? (
                <img src={s.src} alt={s.alt ?? `slide-${i}`} draggable="false" />
              ) : (
                s
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Play/Pause (left vertical) */}
      {showPlayPause && slidesCount > 1 && (
        <button
          aria-label={playing ? "Pause carousel" : "Play carousel"}
          className="carousel-playpause"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "❚❚" : "►"}
        </button>
      )}




      {/* Arrows (right) */}
      {showArrows && slidesCount > 1 && (
        <div className="carousel-arrows">
          <button className="arrow-btn" onClick={prev} aria-label="Previous">
            ‹
          </button>
          <button className="arrow-btn" onClick={next} aria-label="Next">
            ›
          </button>
        </div>
      )}

      {/* Dots (center bottom) */}
      {showDots && slidesCount > 1 && (
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
