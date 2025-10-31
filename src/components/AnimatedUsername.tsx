import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface AnimatedUsernameProps {
  name: string;
}

export function AnimatedUsername({ name }: AnimatedUsernameProps) {
  const welcomeText = "BEM VINDO(A)";
  const upperName = name.toUpperCase();
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    
    const typeInterval = setInterval(() => {
      if (showWelcome) {
        // Typing welcome message
        if (!isDeleting && currentIndex < welcomeText.length) {
          setDisplayText(welcomeText.slice(0, currentIndex + 1));
          currentIndex++;
        } 
        // Finished typing, wait then start deleting
        else if (!isDeleting && currentIndex === welcomeText.length) {
          setTimeout(() => {
            isDeleting = true;
          }, 1500);
        }
        // Deleting welcome message
        else if (isDeleting && currentIndex > 0) {
          currentIndex--;
          setDisplayText(welcomeText.slice(0, currentIndex));
        }
        // Finished deleting, switch to name
        else if (isDeleting && currentIndex === 0) {
          setShowWelcome(false);
          setIsTyping(true);
        }
      } else {
        // Typing user name
        if (currentIndex < upperName.length) {
          setDisplayText(upperName.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
        }
      }
    }, showWelcome && isDeleting ? 50 : 100);

    return () => clearInterval(typeInterval);
  }, [showWelcome, upperName]);

  return (
    <div className="flex items-center gap-2">
      <User className="w-4 h-4 text-primary animate-pulse" />
      <span className="font-medium text-sm neon-text">
        {displayText.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block letter-jump"
            style={{
              animationDelay: `${i * 0.05}s`
            }}
          >
            {char}
          </span>
        ))}
        {isTyping && <span className="inline-block w-0.5 h-4 bg-accent ml-1 animate-pulse" />}
      </span>
    </div>
  );
}
