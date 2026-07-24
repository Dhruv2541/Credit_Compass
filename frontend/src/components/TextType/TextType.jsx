import React, { useState, useEffect, useCallback } from 'react';
import './TextType.css';

export default function TextType({
  text = [],
  texts = [],
  typingSpeed = 75,
  deletingSpeed = 50,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = "_",
  variableSpeedEnabled = false,
  variableSpeedMin = 60,
  variableSpeedMax = 120,
  cursorBlinkDuration = 0.5,
  loop = true,
  className = ""
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Merge text and texts props
  const phrases = React.useMemo(() => {
    if (texts && texts.length > 0) return texts;
    if (Array.isArray(text)) return text;
    if (typeof text === 'string') return [text];
    return [];
  }, [text, texts]);

  const getRandomSpeed = useCallback((min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }, []);

  useEffect(() => {
    if (phrases.length === 0) return;

    const currentPhrase = phrases[currentTextIndex];
    let timer;

    if (!isDeleting) {
      // Typing phase
      if (displayedText.length < currentPhrase.length) {
        const nextChar = currentPhrase.slice(0, displayedText.length + 1);
        const speed = variableSpeedEnabled
          ? getRandomSpeed(variableSpeedMin, variableSpeedMax)
          : typingSpeed;

        timer = setTimeout(() => {
          setDisplayedText(nextChar);
        }, speed);
      } else {
        // Finished typing -> pause then start deleting
        // If looping is disabled and this is the final phrase, freeze here.
        if (!loop && currentTextIndex === phrases.length - 1) {
          return;
        }

        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting phase
      if (displayedText.length > 0) {
        const nextChar = currentPhrase.slice(0, displayedText.length - 1);
        timer = setTimeout(() => {
          setDisplayedText(nextChar);
        }, deletingSpeed);
      } else {
        // Finished deleting -> move to next phrase
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }, 300); // 300ms pause before starting typing next phrase
      }
    }

    return () => clearTimeout(timer);
  }, [
    displayedText,
    isDeleting,
    currentTextIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    variableSpeedEnabled,
    variableSpeedMin,
    variableSpeedMax,
    getRandomSpeed,
    loop
  ]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayedText}</span>
      {showCursor && (
        <span
          className="text-type-cursor font-normal ml-0.5"
          style={{ '--cursor-blink-duration': `${cursorBlinkDuration}s` }}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
}
