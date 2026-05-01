import { Crown, Dices, MoveDown, MoveUp } from "lucide-react";
import type { Player } from "@/game/constants";
import { cn } from "@/lib/utils";

interface ScoreboardProps {
  players: Player[];
  currentPlayerId: string | null;
  winnerId: string | null;
}

export const Scoreboard = ({ players, currentPlayerId, winnerId }: ScoreboardProps) => {
  const sorted = [...players].sort((a, b) => b.position - a.position);

  return (
    <div className="rounded-3xl bg-card/60 backdrop-blur-sm border border-border p-5 shadow-card">
      <h2 className="font-display text-lg mb-4 flex items-center gap-2">
        <Crown className="h-5 w-5 text-primary" /> Scoreboard
      </h2>
      <ul className="space-y-2">
        {sorted.map((p, idx) => {
          const isCurrent = p.id === currentPlayerId;
          const isWinner = p.id === winnerId;
          return (
            <li
              key={p.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 px-3 py-2.5 transition-all",
                isCurrent && "border-primary/70 bg-primary/10 shadow-glow",
                isWinner && "border-accent bg-accent/15"
              )}
            >
              <span className="font-display text-sm text-muted-foreground w-5">{idx + 1}</span>
              <span
                className="h-6 w-6 shrink-0 rounded-full border-2 border-white/80 shadow-token"
                style={{ backgroundColor: p.color.bg }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold truncate">{p.name}</p>
                  {isWinner && <Crown className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Dices className="h-3 w-3" />{p.rolls}</span>
                  <span className="flex items-center gap-1 text-accent"><MoveUp className="h-3 w-3" />{p.laddersClimbed}</span>
                  <span className="flex items-center gap-1 text-destructive"><MoveDown className="h-3 w-3" />{p.snakesBitten}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-xl text-gradient leading-none">{p.position}</p>
                <p className="text-[10px] text-muted-foreground tracking-wider">/ 100</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
