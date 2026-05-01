import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

interface DiceProps {
  value: number;
  rolling: boolean;
  onRoll: () => void;
  disabled?: boolean;
}

export const Dice = ({ value, rolling, onRoll, disabled }: DiceProps) => {
  const Icon = ICONS[(value - 1 + 6) % 6] ?? Dice1;
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onRoll}
        disabled={disabled || rolling}
        className={cn(
          "relative h-28 w-28 rounded-3xl bg-gradient-primary text-primary-foreground shadow-glow",
          "flex items-center justify-center transition-transform",
          "hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed",
          rolling && "animate-dice-roll",
          !disabled && !rolling && "animate-pulse-ring"
        )}
        aria-label="Roll dice"
      >
        <Icon className="h-16 w-16" strokeWidth={2.5} />
      </button>
      <button
        onClick={onRoll}
        disabled={disabled || rolling}
        className="font-display text-sm tracking-widest text-primary hover:text-accent disabled:text-muted-foreground transition-colors"
      >
        {rolling ? "ROLLING…" : "TAP TO ROLL"}
      </button>
    </div>
  );
};
