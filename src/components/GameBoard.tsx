import { memo } from 'react';

interface TileProps {
  letter: string;
  status: 'empty' | 'filled' | 'correct' | 'present' | 'absent';
  revealed: boolean;
}

const Tile = memo(({ letter, status, revealed }: TileProps) => {
  const getBackgroundColor = () => {
    if (!revealed) {
      return status === 'filled' ? 'bg-[hsl(var(--tile-filled))]' : 'bg-[hsl(var(--tile-empty))]';
    }
    switch (status) {
      case 'correct':
        return 'bg-[hsl(var(--tile-correct))]';
      case 'present':
        return 'bg-[hsl(var(--tile-present))]';
      case 'absent':
        return 'bg-[hsl(var(--tile-absent))]';
      default:
        return 'bg-[hsl(var(--tile-empty))]';
    }
  };

  const getBorderColor = () => {
    if (revealed) return 'border-transparent';
    return status === 'filled' ? 'border-[hsl(var(--foreground))]' : 'border-[hsl(var(--tile-border))]';
  };

  const getTextColor = () => {
    return revealed && status !== 'empty' ? 'text-white' : 'text-foreground';
  };

  return (
    <div
      className={`
        w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center
        text-2xl sm:text-3xl font-bold uppercase rounded-sm
        transition-all duration-300
        ${getBackgroundColor()}
        ${getBorderColor()}
        ${getTextColor()}
        ${revealed ? 'scale-105' : 'scale-100'}
      `}
    >
      {letter}
    </div>
  );
});

Tile.displayName = 'Tile';

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  maxAttempts: number;
  wordLength: number;
  evaluations: Array<Array<'correct' | 'present' | 'absent' | 'empty'>>;
}

export const GameBoard = memo(({ guesses, currentGuess, maxAttempts, wordLength, evaluations }: GameBoardProps) => {
  const rows: Array<Array<{ letter: string; status: 'empty' | 'filled' | 'correct' | 'present' | 'absent'; revealed: boolean }>> = Array.from({ length: maxAttempts }, (_, rowIndex) => {
    if (rowIndex < guesses.length) {
      // Completed guess
      return guesses[rowIndex].split('').map((letter, colIndex) => ({
        letter,
        status: (evaluations[rowIndex]?.[colIndex] || 'empty') as 'correct' | 'present' | 'absent' | 'empty',
        revealed: true,
      }));
    } else if (rowIndex === guesses.length) {
      // Current guess being typed
      const letters = currentGuess.split('');
      return Array.from({ length: wordLength }, (_, colIndex) => ({
        letter: letters[colIndex] || '',
        status: (letters[colIndex] ? 'filled' : 'empty') as 'filled' | 'empty',
        revealed: false,
      }));
    } else {
      // Empty rows
      return Array.from({ length: wordLength }, () => ({
        letter: '',
        status: 'empty' as const,
        revealed: false,
      }));
    }
  });

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 sm:gap-2">
          {row.map((tile, colIndex) => (
            <Tile
              key={colIndex}
              letter={tile.letter}
              status={tile.status}
              revealed={tile.revealed}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
