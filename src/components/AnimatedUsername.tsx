import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface AnimatedUsernameProps {
  name: string;
}

export function AnimatedUsername({ name }: AnimatedUsernameProps) {
  const upperName = name.toUpperCase();
  const [displayText, setDisplayText] = useState(upperName);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * upperName.length);
      setActiveIndex(randomIndex);

      // Temporarily replace with random letter
      const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const newText = upperName.split('').map((char, i) => 
        i === randomIndex ? randomChar : char
      ).join('');
      setDisplayText(newText);

      // Restore original letter after delay
      setTimeout(() => {
        setDisplayText(upperName);
        setActiveIndex(-1);
      }, 200);
    }, 2000);

    return () => clearInterval(interval);
  }, [upperName]);

  return (
    <div className="flex items-center gap-2">
      <User className="w-4 h-4 text-blue-300 animate-bounce" />
      <span className="font-medium text-sm neon-text">
        {displayText.split('').map((char, i) => (
          <span
            key={i}
            className={`inline-block letter-bounce ${i === activeIndex ? 'text-accent' : ''}`}
            style={{
              animationDelay: `${i * 0.1}s`
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}
