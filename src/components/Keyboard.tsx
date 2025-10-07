import { memo } from 'react';
import { Delete } from 'lucide-react';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStates: Record<string, 'correct' | 'present' | 'absent' | 'unused'>;
  disabled?: boolean;
}

export const Keyboard = memo(({ onKeyPress, keyStates, disabled = false }: KeyboardProps) => {
  const getKeyColor = (key: string) => {
    const state = keyStates[key];
    if (!state || state === 'unused') {
      return 'bg-[hsl(var(--key-bg))] text-[hsl(var(--key-text))] hover:bg-[hsl(var(--key-bg))]/80';
    }
    switch (state) {
      case 'correct':
        return 'bg-[hsl(var(--key-correct))] text-white';
      case 'present':
        return 'bg-[hsl(var(--key-present))] text-white';
      case 'absent':
        return 'bg-[hsl(var(--key-absent))] text-white';
      default:
        return 'bg-[hsl(var(--key-bg))] text-[hsl(var(--key-text))]';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center mb-1 sm:mb-2">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                disabled={disabled}
                className={`
                  ${isSpecial ? 'px-3 sm:px-4 text-xs sm:text-sm' : 'w-8 sm:w-10 text-sm sm:text-base'}
                  h-12 sm:h-14 rounded font-bold uppercase
                  transition-all duration-150
                  ${getKeyColor(key)}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                  flex items-center justify-center
                `}
              >
                {key === 'BACKSPACE' ? (
                  <Delete className="w-5 h-5" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
});

Keyboard.displayName = 'Keyboard';
