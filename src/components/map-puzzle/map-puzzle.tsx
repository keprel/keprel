"use client";

import { usePuzzle } from "./use-puzzle";
import WorldMap from "./world-map";

interface MapPuzzleProps {
  onSolved: () => void;
}

export function MapPuzzle({ onSolved }: MapPuzzleProps) {
  const { target, hintLevel, guessedIds, solved, handleGuess } =
    usePuzzle(onSolved);

  return (
    <div className="flex w-full max-w-4xl flex-col items-center px-2 sm:px-4">
      {/* Prompt */}
      <h2 className="font-mono text-base tracking-wide text-foreground/80 sm:text-lg">
        {solved ? (
          <span className="text-primary">Correct!</span>
        ) : (
          <>
            Find{" "}
            <span className="text-primary font-medium">{target.name}</span>
          </>
        )}
      </h2>

      {/* Map */}
      <WorldMap
        target={target}
        hintLevel={hintLevel}
        guessedIds={guessedIds}
        solved={solved}
        onGuess={handleGuess}
      />

      {/* Hints */}
      <div className="h-6 font-mono text-xs text-muted-foreground sm:text-sm">
        {!solved && hintLevel === 1 && (
          <span className="animate-fade-in">
            It&apos;s in {target.continent}
          </span>
        )}
        {!solved && hintLevel === 2 && (
          <span className="animate-fade-in">
            Look near {target.region}
          </span>
        )}
        {!solved && hintLevel >= 3 && (
          <span className="animate-fade-in text-primary/70">
            It&apos;s glowing...
          </span>
        )}
      </div>
    </div>
  );
}
