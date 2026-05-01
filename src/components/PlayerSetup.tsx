import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Play, Sparkles } from "lucide-react";
import { PLAYER_COLORS, type Player } from "@/game/constants";

interface PlayerSetupProps {
  onStart: (players: Player[]) => void;
}

interface Draft {
  name: string;
  colorIndex: number;
}

export const PlayerSetup = ({ onStart }: PlayerSetupProps) => {
  const [drafts, setDrafts] = useState<Draft[]>([
    { name: "", colorIndex: 0 },
    { name: "", colorIndex: 1 },
  ]);

  const addPlayer = () => {
    if (drafts.length >= 6) return;
    const usedColors = new Set(drafts.map((d) => d.colorIndex));
    const nextColor = PLAYER_COLORS.findIndex((_, i) => !usedColors.has(i));
    setDrafts([...drafts, { name: "", colorIndex: nextColor === -1 ? 0 : nextColor }]);
  };

  const remove = (i: number) => {
    if (drafts.length <= 2) return;
    setDrafts(drafts.filter((_, idx) => idx !== i));
  };

  const updateName = (i: number, name: string) =>
    setDrafts(drafts.map((d, idx) => (idx === i ? { ...d, name } : d)));

  const cycleColor = (i: number) =>
    setDrafts(
      drafts.map((d, idx) =>
        idx === i ? { ...d, colorIndex: (d.colorIndex + 1) % PLAYER_COLORS.length } : d
      )
    );

  const valid = drafts.every((d) => d.name.trim().length > 0) &&
    new Set(drafts.map((d) => d.colorIndex)).size === drafts.length;

  const handleStart = () => {
    if (!valid) return;
    const players: Player[] = drafts.map((d, i) => ({
      id: `p-${i}-${Date.now()}`,
      name: d.name.trim(),
      position: 0,
      color: PLAYER_COLORS[d.colorIndex],
      rolls: 0,
      laddersClimbed: 0,
      snakesBitten: 0,
    }));
    onStart(players);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/60 border border-border mb-5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs tracking-widest font-semibold text-muted-foreground">CLASSIC BOARD GAME</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl mb-4">
            <span className="text-gradient">SNAKES</span>
            <span className="text-foreground"> & </span>
            <span className="text-accent">LADDERS</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Roll the dice. Climb the ladders. Dodge the snakes. First to <span className="text-primary font-semibold">100</span> wins.
          </p>
        </div>

        <div className="rounded-3xl bg-card/60 backdrop-blur-sm border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl">Players</h2>
            <span className="text-xs text-muted-foreground">{drafts.length} / 6</span>
          </div>

          <div className="space-y-3">
            {drafts.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => cycleColor(i)}
                  className="h-11 w-11 shrink-0 rounded-xl border-2 border-white/80 shadow-token transition-transform hover:scale-105"
                  style={{ backgroundColor: PLAYER_COLORS[d.colorIndex].bg }}
                  title={`Color: ${PLAYER_COLORS[d.colorIndex].name} (tap to change)`}
                  aria-label="Change color"
                />
                <Input
                  placeholder={`Player ${i + 1} name`}
                  value={d.name}
                  maxLength={16}
                  onChange={(e) => updateName(i, e.target.value)}
                  className="h-11 bg-background/60 border-border text-base"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(i)}
                  disabled={drafts.length <= 2}
                  className="h-11 w-11 text-muted-foreground hover:text-destructive"
                  aria-label="Remove player"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addPlayer}
            disabled={drafts.length >= 6}
            className="w-full mt-3 h-11 border-dashed bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" /> Add player
          </Button>

          <Button
            onClick={handleStart}
            disabled={!valid}
            className="w-full mt-6 h-14 text-base font-display tracking-widest bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
          >
            <Play className="h-5 w-5 mr-2" /> START GAME
          </Button>

          {!valid && drafts.some((d) => !d.name.trim()) && (
            <p className="text-xs text-muted-foreground mt-3 text-center">Enter a name for every player to start.</p>
          )}
        </div>
      </div>
    </div>
  );
};
