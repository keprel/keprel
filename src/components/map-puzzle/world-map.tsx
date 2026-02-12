"use client";

import { useState, useMemo, useCallback, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { CONTINENT_BY_ID, type PuzzleCountry } from "./country-data";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Antarctica numeric ID
const ANTARCTICA_ID = "010";

interface WorldMapProps {
  target: PuzzleCountry;
  hintLevel: 0 | 1 | 2 | 3;
  guessedIds: Set<string>;
  solved: boolean;
  onGuess: (geoId: string) => void;
}

/** IDs that just flashed wrong — used for brief red animation */
function useFlash() {
  const [flashId, setFlashId] = useState<string | null>(null);

  const flash = useCallback((id: string) => {
    setFlashId(id);
    setTimeout(() => setFlashId(null), 500);
  }, []);

  return { flashId, flash };
}

function getFill(
  geoId: string,
  target: PuzzleCountry,
  hintLevel: 0 | 1 | 2 | 3,
  guessedIds: Set<string>,
  solved: boolean,
  flashId: string | null,
): string {
  // Correct answer — glow blue
  if (geoId === target.numericId && solved) return "#4f8ff7";

  // Just-clicked wrong — flash red
  if (geoId === flashId) return "#dc2626";

  // Previously guessed wrong — dim
  if (guessedIds.has(geoId)) return "#1e2640";

  // Hint level 3: target pulses (handled via className)
  // Hint level 2: neighbors highlighted
  if (hintLevel >= 2 && target.neighborIds.includes(geoId)) return "#4a6a9e";

  // Hint level 1: continent countries subtly highlighted
  if (hintLevel >= 1 && CONTINENT_BY_ID[geoId] === target.continent)
    return "#3a5070";

  // Default muted fill
  return "#2a3a55";
}

function WorldMap({ target, hintLevel, guessedIds, solved, onGuess }: WorldMapProps) {
  const { flashId, flash } = useFlash();

  const zoomCenter = useMemo<[number, number]>(() => {
    if (hintLevel >= 2) return target.centroid;
    return [0, 20];
  }, [hintLevel, target.centroid]);

  const zoomLevel = hintLevel >= 2 ? 3 : 1;

  const handleClick = useCallback(
    (geoId: string) => {
      if (solved) return;
      if (guessedIds.has(geoId)) return;
      if (geoId !== target.numericId) flash(geoId);
      onGuess(geoId);
    },
    [solved, guessedIds, target.numericId, flash, onGuess],
  );

  return (
    <div className="mx-auto -mt-2 w-full max-w-4xl sm:-mt-4">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 180 }}
        width={800}
        height={450}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup
          center={zoomCenter}
          zoom={zoomLevel}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies
                .filter((geo) => geo.id !== ANTARCTICA_ID)
                .map((geo) => {
                  const geoId = geo.id as string;
                  const isTarget = geoId === target.numericId;
                  const fill = getFill(
                    geoId,
                    target,
                    hintLevel,
                    guessedIds,
                    solved,
                    flashId,
                  );

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleClick(geoId)}
                      fill={fill}
                      stroke="#0f1628"
                      strokeWidth={0.5}
                      className={
                        isTarget && hintLevel >= 3 && !solved
                          ? "animate-pulse-country"
                          : geoId === flashId
                            ? "animate-flash-wrong"
                            : ""
                      }
                      style={{
                        default: { outline: "none", cursor: solved ? "default" : "pointer" },
                        hover: {
                          outline: "none",
                          fill: solved
                            ? fill
                            : guessedIds.has(geoId)
                              ? "#1e2640"
                              : "#4a6a9e",
                          cursor: solved ? "default" : "pointer",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                }) as unknown as void
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default memo(WorldMap);
