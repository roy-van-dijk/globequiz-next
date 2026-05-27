import { useState } from "react";
import classes from "./CountryList.module.css";

interface Country {
  code: string;
  name: string;
}

interface CountryListProps {
  allCountries: Country[];
  guessedCountries: Set<string>;
}

type ViewMode = "mixed" | "split";

function CountryItem({ name, guessed }: { name: string; guessed: boolean }) {
  return (
    <li className={`${classes.item} ${guessed ? classes.guessed : classes.missed}`}>
      <span className={classes.dot} />
      {name}
    </li>
  );
}

function CountryList({ allCountries, guessedCountries }: Readonly<CountryListProps>) {
  const [viewMode, setViewMode] = useState<ViewMode>("mixed");

  const guessedList = allCountries.filter((c) => guessedCountries.has(c.code));
  const missedList = allCountries.filter((c) => !guessedCountries.has(c.code));

  return (
    <div className={classes.container}>
      <div className={classes.toolbar}>
        <button
          type="button"
          className={`${classes.toggle} ${viewMode === "mixed" ? classes.active : ""}`}
          onClick={() => setViewMode("mixed")}
        >
          Mixed
        </button>
        <button
          type="button"
          className={`${classes.toggle} ${viewMode === "split" ? classes.active : ""}`}
          onClick={() => setViewMode("split")}
        >
          Split
        </button>
      </div>

      {viewMode === "mixed" ? (
        <ul className={classes.list}>
          {allCountries.map((c) => (
            <CountryItem key={c.code} name={c.name} guessed={guessedCountries.has(c.code)} />
          ))}
        </ul>
      ) : (
        <div className={classes.splitView}>
          <div>
            <h3 className={classes.groupHeader}>Guessed ({guessedList.length})</h3>
            <ul className={classes.list}>
              {guessedList.map((c) => (
                <CountryItem key={c.code} name={c.name} guessed={true} />
              ))}
            </ul>
          </div>
          <div>
            <h3 className={classes.groupHeader}>Not guessed ({missedList.length})</h3>
            <ul className={classes.list}>
              {missedList.map((c) => (
                <CountryItem key={c.code} name={c.name} guessed={false} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default CountryList;
