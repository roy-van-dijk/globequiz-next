import i18nIsoCountries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { type ChangeEvent, useRef, useState } from "react";
import ZoomableMap from "../../components/zoomable-map/ZoomableMap";
import CountryList from "./CountryList";
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

const allCountriesList = Object.entries(i18nIsoCountries.getNames("en"))
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const totalCountries = allCountriesList.length;

function Countries() {
  const [guessedCountries, setGuessedCountries] = useState<Set<string>>(new Set());
  const [isGivenUp, setIsGivenUp] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { formattedTime, hasStarted, isFinished } = useQuizTimer(guessedCountries.size, totalCountries, isGivenUp, resetCount);

  const missedCountries = isGivenUp
    ? new Set(allCountriesList.map((c) => c.code).filter((code) => !guessedCountries.has(code)))
    : undefined;

  const handleGiveUp = () => {
    if (window.confirm("Are you sure you want to give up? All countries will be revealed.")) {
      setIsGivenUp(true);
    }
  };

  const handleTryAgain = () => {
    setGuessedCountries(new Set());
    setIsGivenUp(false);
    setResetCount((c) => c + 1);
  };

  const handleCopyResults = () => {
    const result = isFinished
      ? `I guessed all ${totalCountries} countries in ${formattedTime} on Globe Quiz! 🌍. https://next.globequiz.com/#/countries`
      : `I guessed ${guessedCountries.size}/${totalCountries} countries in ${formattedTime} on Globe Quiz! 🌍. https://next.globequiz.com/#/countries`;
    navigator.clipboard.writeText(result);
  };

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
        <ZoomableMap mapUrl="/maps/world-map.svg" guessedCountries={guessedCountries} missedCountries={missedCountries} />
      </div>

      <div className={classes.statsRow}>
        <span>Guessed {guessedCountries.size} / {totalCountries}</span>
        {hasStarted && (
          <span className={`${classes.timer} ${isFinished || isGivenUp ? classes.timerFinished : ""}`}>
            {formattedTime}
          </span>
        )}
      </div>

      {isFinished && (
        <div className={classes.finishedMessage}>
          You guessed all {totalCountries} countries in {formattedTime}!
        </div>
      )}

      {!isGivenUp && !isFinished && (
        <div className={classes.inputRow}>
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
          <button type="button" className={classes.giveUpButton} onClick={handleGiveUp}>
            Give up
          </button>
        </div>
      )}

      {(isGivenUp || isFinished) && (
        <div className={classes.inputRow}>
          <button type="button" className={classes.tryAgainButton} onClick={handleTryAgain}>
            Try Again
          </button>
          <button type="button" className={classes.copyButton} onClick={handleCopyResults}>
            Copy Results
          </button>
        </div>
      )}

      {isGivenUp && (
        <CountryList allCountries={allCountriesList} guessedCountries={guessedCountries} />
      )}
    </div>
  );
}

export default Countries;
