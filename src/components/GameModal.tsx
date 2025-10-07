import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  won: boolean;
  answer: string;
  attempts: number;
  onPlayAgain: () => void;
}

export const GameModal = ({ isOpen, onClose, won, answer, attempts, onPlayAgain }: GameModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {won ? 'You Won! 🏆' : '😔 You Lost!'}
          </DialogTitle>
          <DialogDescription className="text-center space-y-4 pt-4">
            {won ? (
              <div>
                <p className="text-lg font-semibold text-foreground">
                  You guessed it in {attempts} attempts!
                </p>
                <p className="text-3xl font-bold text-[hsl(var(--tile-correct))] mt-2">
                  {answer}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-foreground">
                  The answer was:
                </p>
                <p className="text-3xl font-bold text-[hsl(var(--tile-correct))] mt-2">
                  {answer}
                </p>
              </div>
            )}
            <Button
              onClick={() => {
                onPlayAgain();
                onClose();
              }}
              className="w-full mt-4"
              size="lg"
            >
              NEW GAME
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
