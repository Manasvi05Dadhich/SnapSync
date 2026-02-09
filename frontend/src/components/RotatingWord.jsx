import { useState, useEffect } from 'react';

const words = ['events', 'reminders', 'tasks'];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const word = words[index];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= word.length) {
        setDisplay(word.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % words.length);
        }, 1500);
      }
    }, 120);
    return () => clearInterval(timer);
  }, [word]);

  return <span className="font-serif italic text-lavender">{display}</span>;
}
