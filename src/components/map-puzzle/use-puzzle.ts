import { useState, useCallback, useMemo } from "react";
import { pickRandomCountry, type PuzzleCountry } from "./country-data";

export interface PuzzleState {
  target: PuzzleCountry;
  wrongCount: number;
  hintLevel: 0 | 1 | 2 | 3;
  guessedIds: Set<string>;
  solved: boolean;
}

export function usePuzzle(onSolved: () => void) {
  const [target] = useState<PuzzleCountry>(pickRandomCountry);
  const [wrongCount, setWrongCount] = useState(0);
  const [guessedIds, setGuessedIds] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(false);

  const hintLevel = useMemo<0 | 1 | 2 | 3>(() => {
    if (wrongCount >= 3) return 3;
    if (wrongCount >= 2) return 2;
    if (wrongCount >= 1) return 1;
    return 0;
  }, [wrongCount]);

  const handleGuess = useCallback(
    (geoId: string) => {
      if (solved) return;

      if (geoId === target.numericId) {
        setSolved(true);
        setTimeout(onSolved, 1200);
      } else {
        setGuessedIds((prev) => new Set(prev).add(geoId));
        setWrongCount((c) => c + 1);
      }
    },
    [solved, target.numericId, onSolved],
  );

  return { target, wrongCount, hintLevel, guessedIds, solved, handleGuess };
}
