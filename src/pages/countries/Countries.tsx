import i18nIsoCountries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { type ChangeEvent, useRef, useState } from "react";
import ZoomableMap from "../../components/zoomable-map/ZoomableMap";
import classes from "./Countries.module.css";
import { useQuizTimer } from "./useQuizTimer";

i18nIsoCountries.registerLocale(enLocale);

const lowercaseCountriesMap: Record<string, string> = (() => {
  const allCountries = i18nIsoCountries.getNames("en", { select: "all" }) as Record<
    string,
    string | string[]
  >;
  const map: Record<string, string> = {};
  for (const code of Object.keys(allCountries)) {
    const nameData = allCountries[code];
    if (Array.isArray(nameData)) {
      for (const singleName of nameData) {
        map[singleName.toLowerCase()] = code;
      }
    } else if (typeof nameData === "string") {
      map[nameData.toLowerCase()] = code;
    }
  }
  return map;
})();

const totalCountries = new Set(Object.values(lowercaseCountriesMap)).size;

function Countries() {
  const [guessedCountries, setGuessedCountries] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const { formattedTime, hasStarted, isFinished } = useQuizTimer(guessedCountries.size, totalCountries);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const cleanInput = value.trim().toLowerCase();
    const countryCode = lowercaseCountriesMap[cleanInput];

    if (countryCode) {
      setGuessedCountries((prev) => {
        if (prev.has(countryCode)) {
          return prev;
        }

        const nextSet = new Set(prev);
        nextSet.add(countryCode);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return nextSet;
      });
    }
  };

  return (
    <div className={classes.guessArea}>
      <div className={classes.mapWrapper}>
        <ZoomableMap mapUrl="/maps/world-map.svg" guessedCountries={guessedCountries} />
      </div>

      <div className={classes.statsRow}>
        <span>Guessed {guessedCountries.size} / {totalCountries}</span>
        {hasStarted && (
          <span className={`${classes.timer} ${isFinished ? classes.timerFinished : ""}`}>
            {formattedTime}
          </span>
        )}
      </div>

      {isFinished && (
        <div className={classes.finishedMessage}>
          You guessed all {totalCountries} countries in {formattedTime}!
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        onChange={handleChange}
        placeholder="Type a country name..."
        style={{
          padding: "12px",
          fontSize: "18px",
          width: "300px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          outline: "none",
        }}
      />
    </div>
  );
}

export default Countries;
