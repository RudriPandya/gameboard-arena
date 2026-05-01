import { useCallback, useEffect, useRef, useState } from "react";
import { Board } from "@/components/Board";
import { Dice } from "@/components/Dice";
import { Scoreboard } from "@/components/Scoreboard";
import { PlayerSetup } from "@/components/PlayerSetup";
import { Button } from "@/components/ui/button";
import { LADDERS, SNAKES, TOTAL_CELLS, type Player } from "@/game/constants";
import { toast } from "sonner";
import { RotateCcw, Trophy, Users } from "lucide-react";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<string>("");
  const rollTimer = useRef<number | null>(null);

  const start = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    setTurn(0);
    setDiceValue(1);
    setWinnerId(null);
    setLastEvent(`${newPlayers[0].name}, you're up first!`);
  };

  const reset = () => {
    setPlayers([]);
    setWinnerId(null);
    setLastEvent("");
  };

  const playAgain = () => {
    setPlayers((prev) =>
      prev.map((p) => ({ ...p, position: 0, rolls: 0, laddersClimbed: 0, snakesBitten: 0 }))
    );
    setTurn(0);
    setDiceValue(1);
    setWinnerId(null);
    setLastEvent(`${players[0]?.name ?? "Player 1"}, you're up first!`);
  };

  const currentPlayer = players[turn] ?? null;

  const roll = useCallback(() => {
    if (rolling || winnerId || !currentPlayer) return;
    setRolling(true);

    // visual roll cycling
    let ticks = 0;
    const interval = window.setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      ticks++;
      if (ticks > 6) window.clearInterval(interval);
    }, 80);

    rollTimer.current = window.setTimeout(() => {
      window.clearInterval(interval);
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalRoll);
      setRolling(false);

      setPlayers((prev) => {
        const next = prev.map((p) => ({ ...p }));
        const me = next[turn];
        let newPos = me.position + finalRoll;
        let event = `${me.name} rolled a ${finalRoll}`;
        let climbed = 0;
        let bitten = 0;

        if (newPos > TOTAL_CELLS) {
          event = `${me.name} rolled ${finalRoll} — needs exact roll to land on 100. Stays at ${me.position}.`;
          newPos = me.position;
        } else if (newPos === TOTAL_CELLS) {
          event = `🏆 ${me.name} reached 100 and WINS!`;
          setWinnerId(me.id);
          toast.success(`${me.name} wins! 🎉`);
        } else if (LADDERS[newPos]) {
          event = `🪜 ${me.name} climbed a ladder from ${newPos} to ${LADDERS[newPos]}!`;
          newPos = LADDERS[newPos];
          climbed = 1;
          toast(`Ladder climbed! ${me.name} → ${newPos}`, { icon: "🪜" });
        } else if (SNAKES[newPos]) {
          event = `🐍 ${me.name} got bitten at ${newPos} and slid to ${SNAKES[newPos]}!`;
          newPos = SNAKES[newPos];
          bitten = 1;
          toast(`Ouch! ${me.name} → ${newPos}`, { icon: "🐍" });
        } else {
          event += ` and moved to ${newPos}.`;
        }

        me.position = newPos;
        me.rolls += 1;
        me.laddersClimbed += climbed;
        me.snakesBitten += bitten;
        setLastEvent(event);
        return next;
      });

      // advance turn after a brief pause (unless we just won — handled by effect via winnerId)
      window.setTimeout(() => {
        setTurn((t) => {
          const total = players.length;
          if (total === 0) return 0;
          return (t + 1) % total;
        });
      }, 600);
    }, 700);
  }, [rolling, winnerId, currentPlayer, turn, players.length]);

  useEffect(() => {
    return () => {
      if (rollTimer.current) window.clearTimeout(rollTimer.current);
    };
  }, []);

  if (players.length === 0) {
    return (
      <main>
        <PlayerSetup onStart={start} />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl">
              <span className="text-gradient">SNAKES</span> & <span className="text-accent">LADDERS</span>
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
              <Users className="h-3 w-3" /> {players.length} players · First to 100 wins
            </p>
          </div>
          <div className="flex gap-2">
            {winnerId && (
              <Button onClick={playAgain} className="bg-gradient-accent text-accent-foreground hover:opacity-90">
                <Trophy className="h-4 w-4 mr-2" /> Play again
              </Button>
            )}
            <Button variant="outline" onClick={reset} className="bg-transparent">
              <RotateCcw className="h-4 w-4 mr-2" /> New game
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="flex flex-col items-center gap-5">
            <Board players={players} currentPlayerId={winnerId ?? currentPlayer?.id ?? null} />

            <div className="w-full max-w-[640px] rounded-2xl border border-border bg-card/60 backdrop-blur-sm px-5 py-4 text-center">
              <p className="text-sm text-muted-foreground min-h-[1.25rem]">{lastEvent}</p>
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="rounded-3xl bg-card/60 backdrop-blur-sm border border-border p-6 shadow-card flex flex-col items-center gap-4">
              {winnerId ? (
                <>
                  <Trophy className="h-10 w-10 text-primary" />
                  <p className="font-display text-xl text-center">
                    {players.find((p) => p.id === winnerId)?.name} <span className="text-gradient">WINS!</span>
                  </p>
                  <Button onClick={playAgain} className="w-full bg-gradient-primary text-primary-foreground">
                    Play again
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border-2 border-white/80 shadow-token"
                      style={{ backgroundColor: currentPlayer?.color.bg }}
                    />
                    <p className="font-display text-base">{currentPlayer?.name}'s turn</p>
                  </div>
                  <Dice value={diceValue} rolling={rolling} onRoll={roll} disabled={!!winnerId} />
                </>
              )}
            </div>

            <Scoreboard players={players} currentPlayerId={currentPlayer?.id ?? null} winnerId={winnerId} />

            <div className="rounded-2xl border border-border bg-card/40 p-4 text-xs text-muted-foreground space-y-1.5">
              <p className="flex items-center gap-2"><span>🪜</span> Land on a ladder to climb up.</p>
              <p className="flex items-center gap-2"><span>🐍</span> Land on a snake to slide down.</p>
              <p className="flex items-center gap-2"><span>🎯</span> Need an exact roll to land on 100.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Index;
