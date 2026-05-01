import { useMemo } from "react";
import { BOARD_SIZE, LADDERS, SNAKES, TOTAL_CELLS, cellToCoord, type Player } from "@/game/constants";
import { cn } from "@/lib/utils";

interface BoardProps {
  players: Player[];
  currentPlayerId: string | null;
}

export const Board = ({ players, currentPlayerId }: BoardProps) => {
  const cells = useMemo(() => {
    const arr: number[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowFromBottom = BOARD_SIZE - 1 - row;
      const isLTR = rowFromBottom % 2 === 0;
      for (let c = 0; c < BOARD_SIZE; c++) {
        const colInRow = isLTR ? c : BOARD_SIZE - 1 - c;
        arr.push(rowFromBottom * BOARD_SIZE + colInRow + 1);
      }
    }
    return arr;
  }, []);

  // Group players by cell so multiple tokens on same cell stack nicely
  const playersByCell = useMemo(() => {
    const map = new Map<number, Player[]>();
    players.forEach((p) => {
      if (p.position < 1) return;
      const list = map.get(p.position) ?? [];
      list.push(p);
      map.set(p.position, list);
    });
    return map;
  }, [players]);

  return (
    <div className="relative aspect-square w-full max-w-[640px] rounded-3xl bg-gradient-board p-3 shadow-card border border-border">
      <div className="grid h-full w-full grid-cols-10 grid-rows-10 gap-[2px] rounded-2xl overflow-hidden">
        {cells.map((cell) => {
          const isSnake = cell in SNAKES;
          const isLadder = cell in LADDERS;
          const isStart = cell === 1;
          const isEnd = cell === TOTAL_CELLS;
          const playersHere = playersByCell.get(cell) ?? [];

          return (
            <div
              key={cell}
              className={cn(
                "relative flex items-start justify-start p-1 text-[10px] sm:text-xs font-semibold",
                "bg-card/40 backdrop-blur-sm",
                (cell + Math.floor((cell - 1) / 10)) % 2 === 0 && "bg-card/60",
                isEnd && "bg-gradient-primary text-primary-foreground",
                isStart && "bg-gradient-accent text-accent-foreground"
              )}
            >
              <span className="opacity-70">{cell}</span>

              {isLadder && (
                <span
                  className="absolute bottom-0.5 right-0.5 text-base sm:text-lg leading-none"
                  title={`Ladder → ${LADDERS[cell]}`}
                >
                  🪜
                </span>
              )}
              {isSnake && (
                <span
                  className="absolute bottom-0.5 right-0.5 text-base sm:text-lg leading-none"
                  title={`Snake → ${SNAKES[cell]}`}
                >
                  🐍
                </span>
              )}

              {playersHere.length > 0 && (
                <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 p-0.5">
                  {playersHere.map((p) => (
                    <div
                      key={p.id}
                      className={cn(
                        "h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full shadow-token border-2 border-white/80 transition-transform",
                        p.id === currentPlayerId && "animate-token-bounce ring-2 ring-offset-1 ring-offset-transparent"
                      )}
                      style={{
                        backgroundColor: p.color.bg,
                        ...(p.id === currentPlayerId
                          ? ({ ["--tw-ring-color" as never]: p.color.ring } as React.CSSProperties)
                          : {}),
                      }}
                      title={p.name}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { cellToCoord };
