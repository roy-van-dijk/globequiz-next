import { type ComponentType, type SVGProps, useEffect, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import classes from "./ZoomableMap.module.css";

interface ZoomableMapProps {
  MapComponent: ComponentType<SVGProps<SVGSVGElement>>;
  guessedCountries: Set<string>;
}

function ZoomableMap({ MapComponent, guessedCountries }: Readonly<ZoomableMapProps>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const greenCountriesSelector = Array.from(guessedCountries)
    .map((code) => `.${code.toLowerCase()}`)
    .join(", ");

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const titles = containerRef.current.querySelectorAll("title");

    titles.forEach((title) => {
      title.remove();
    });
  }, []);

  return (
    <div className={classes.mapContainer} ref={containerRef}>
      {greenCountriesSelector && (
        <style>{`
          ${greenCountriesSelector} {
            fill: #22c55e !important;
            transition: fill 0.3s ease;
          }
        `}</style>
      )}

      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={20}
        centerOnInit={true}
        panning={{ velocityDisabled: true }}
        limitToBounds={true}
        zoomAnimation={{ disabled: true }}
        wheel={{
          step: 0.01,
          activationKeys: [],
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className={classes.mapControls}>
              <button onClick={() => zoomIn()} type="button">
                +
              </button>
              <button onClick={() => zoomOut()} type="button">
                -
              </button>
              <button onClick={() => resetTransform()} type="button">
                Reset
              </button>
            </div>

            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "100%", height: "100%" }}
            >
              <MapComponent />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default ZoomableMap;
