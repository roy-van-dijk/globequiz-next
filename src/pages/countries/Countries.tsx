import i18nIsoCountries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { type ChangeEvent, useRef, useState } from "react";
import WorldMap from "../../assets/game-types/countries/world-map.svg?react";
import ZoomableMap from "../../components/zoomable-map/ZoomableMap";
import classes from "./Countries.module.css";

i18nIsoCountries.registerLocale(enLocale);

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

function Countries() {
  const [guessedCountries, setGuessedCountries] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

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

  const cssStyleRules = Array.from(guessedCountries)
    .map((code) => `.${code.toLowerCase()} { fill: #22c55e !important; }`)
    .join("\n");

  return (
    <div className={classes.guessArea}>
      <style>{cssStyleRules}</style>

      <div className={classes.mapWrapper}>
        <ZoomableMap MapComponent={WorldMap} guessedCountries={guessedCountries} />
      </div>

      <div>Guessed {guessedCountries.size}</div>

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
