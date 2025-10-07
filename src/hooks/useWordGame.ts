import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

type KeyState = 'correct' | 'present' | 'absent' | 'unused';
type TileStatus = 'correct' | 'present' | 'absent' | 'empty';

interface UseWordGameProps {
  wordList: string[];
  maxAttempts?: number;
}

export const useWordGame = ({ wordList, maxAttempts = 6 }: UseWordGameProps) => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keyStates, setKeyStates] = useState<Record<string, KeyState>>({});
  const [evaluations, setEvaluations] = useState<TileStatus[][]>([]);

  // Initialize game with random word
  const initializeGame = useCallback(() => {
    if (wordList.length === 0) return;
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setKeyStates({});
    setEvaluations([]);
  }, [wordList]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Evaluate a guess against target word
  const evaluateGuess = useCallback((guess: string): TileStatus[] => {
    const result: TileStatus[] = new Array(guess.length).fill('absent');
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');

    // First pass: mark correct positions
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        result[i] = 'correct';
        targetLetters[i] = '';
      }
    });

    // Second pass: mark present letters
    guessLetters.forEach((letter, i) => {
      if (result[i] !== 'correct') {
        const targetIndex = targetLetters.indexOf(letter);
        if (targetIndex !== -1) {
          result[i] = 'present';
          targetLetters[targetIndex] = '';
        }
      }
    });

    return result;
  }, [targetWord]);

  // Update keyboard states based on evaluation
  const updateKeyStates = useCallback((guess: string, evaluation: TileStatus[]) => {
    const newKeyStates = { ...keyStates };
    
    guess.split('').forEach((letter, i) => {
      const currentState = newKeyStates[letter];
      const newState = evaluation[i];
      
      // Priority: correct > present > absent
      if (newState === 'correct') {
        newKeyStates[letter] = 'correct';
      } else if (newState === 'present' && currentState !== 'correct') {
        newKeyStates[letter] = 'present';
      } else if (newState === 'absent' && (!currentState || currentState === 'unused')) {
        newKeyStates[letter] = 'absent';
      }
    });

    setKeyStates(newKeyStates);
  }, [keyStates]);

  // Trigger confetti animation
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#6aaa64', '#c9b458', '#787c7e', '#ffffff'],
      });
    }, 50);
  };

  // Submit current guess
  const submitGuess = useCallback(() => {
    if (currentGuess.length !== targetWord.length) {
      toast.error('Too short!');
      return;
    }

    if (!wordList.includes(currentGuess)) {
      toast.error('Word not found');
      return;
    }

    const evaluation = evaluateGuess(currentGuess);
    setEvaluations([...evaluations, evaluation]);
    updateKeyStates(currentGuess, evaluation);
    
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Check win condition
    if (currentGuess === targetWord) {
      setWon(true);
      setGameOver(true);
      triggerConfetti();
      setTimeout(() => {
        toast.success(`Awesome! You guessed it in ${newGuesses.length} tries!`);
      }, 500);
      return;
    }

    // Check lose condition
    if (newGuesses.length >= maxAttempts) {
      setGameOver(true);
      setTimeout(() => {
        toast.error(`The correct answer is: ${targetWord}`);
      }, 500);
    }
  }, [currentGuess, targetWord, wordList, guesses, evaluateGuess, updateKeyStates, maxAttempts, evaluations]);

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < targetWord.length && key.match(/^[A-Z]$/)) {
      setCurrentGuess(currentGuess + key);
    }
  }, [gameOver, currentGuess, targetWord.length, submitGuess]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (e.key.match(/^[a-zA-Z]$/)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, gameOver]);

  return {
    targetWord,
    guesses,
    currentGuess,
    gameOver,
    won,
    keyStates,
    evaluations,
    wordLength: targetWord.length,
    handleKeyPress,
    initializeGame,
  };
};
