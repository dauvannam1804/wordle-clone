import { useEffect, useState } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { Keyboard } from '@/components/Keyboard';
import { GameModal } from '@/components/GameModal';
import { useWordGame } from '@/hooks/useWordGame';
import { toast } from 'sonner';
import { HelpCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAX_ATTEMPTS = 6;

const Index = () => {
  const [wordList, setWordList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Load words from vocabs.txt
  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch('/vocabs.txt');
        if (!response.ok) throw new Error('Failed to load vocabulary file');
        
        const text = await response.text();
        const words = text
          .split('\n')
          .map(word => word.trim().toUpperCase())
          .filter(word => word.length === 5); // Only 5-letter words
        
        if (words.length === 0) {
          throw new Error('No valid words found in vocabulary file');
        }
        
        setWordList(words);
        setLoading(false);
      } catch (error) {
        console.error('Error loading words:', error);
        toast.error('Không thể tải danh sách từ. Sử dụng từ mẫu.');
        
        // Fallback word list
        setWordList(['APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE']);
        setLoading(false);
      }
    };

    loadWords();
  }, []);

  const {
    guesses,
    currentGuess,
    gameOver,
    won,
    keyStates,
    evaluations,
    wordLength,
    handleKeyPress,
    initializeGame,
    targetWord,
  } = useWordGame({ wordList, maxAttempts: MAX_ATTEMPTS });

  // Show modal when game is over
  useEffect(() => {
    if (gameOver) {
      setTimeout(() => setShowModal(true), 1500);
    }
  }, [gameOver]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-4 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <HelpCircle className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">WORDLE</h1>
          <Button variant="ghost" size="icon">
            <BarChart3 className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Game Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
        <GameBoard
          guesses={guesses}
          currentGuess={currentGuess}
          maxAttempts={MAX_ATTEMPTS}
          wordLength={wordLength}
          evaluations={evaluations}
        />

        <Keyboard
          onKeyPress={handleKeyPress}
          keyStates={keyStates}
          disabled={gameOver}
        />

        {gameOver && (
          <Button
            onClick={initializeGame}
            size="lg"
            className="mt-4"
          >
            NEW GAME
          </Button>
        )}
      </main>

      {/* Game Over Modal */}
      <GameModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        won={won}
        answer={targetWord}
        attempts={guesses.length}
        onPlayAgain={initializeGame}
      />

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border">
        <p>Press any key or click to play • {wordList.length} words available</p>
      </footer>
    </div>
  );
};

export default Index;
