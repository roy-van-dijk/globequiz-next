import { useEffect, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import classes from "./ZoomableMap.module.css";

interface ZoomableMapProps {
  mapUrl: string;
  guessedCountries: Set<string>;
  missedCountries?: Set<string>;
}

function ZoomableMap({ mapUrl, guessedCountries, missedCountries }: Readonly<ZoomableMapProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    const objectElement = objectRef.current;
    if (!objectElement) {
      return;
    }

    const svgDoc = objectElement.contentDocument;
    if (!svgDoc) {
      return;
    }

    for (const code of guessedCountries) {
      const paths = svgDoc.querySelectorAll(`.${code.toLowerCase()}`);
      for (const path of paths) {
        (path as SVGPathElement).style.fill = "#22c55e";
      }
    }

    if (missedCountries) {
      for (const code of missedCountries) {
        const paths = svgDoc.querySelectorAll(`.${code.toLowerCase()}`);
        for (const path of paths) {
          (path as SVGPathElement).style.fill = "#ef4444";
        }
      }
    }
  }, [guessedCountries, missedCountries]);

  const handleMapLoad = () => {
    const objectElement = objectRef.current;
    if (!objectElement) {
      return;
    }

    const svgDoc = objectElement.contentDocument;
    if (!svgDoc) {
      return;
    }

    const titles = svgDoc.querySelectorAll("title");
    titles.forEach((title) => {
      title.remove();
    });

    for (const code of guessedCountries) {
      const paths = svgDoc.querySelectorAll(`.${code.toLowerCase()}`);
      for (const path of paths) {
        (path as SVGPathElement).style.fill = "#22c55e";
      }
    }

    if (missedCountries) {
      for (const code of missedCountries) {
        const paths = svgDoc.querySelectorAll(`.${code.toLowerCase()}`);
        for (const path of paths) {
          (path as SVGPathElement).style.fill = "#ef4444";
        }
      }
    }
  };

  return (
    <div className={classes.mapContainer} ref={containerRef}>
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
              <object
                ref={objectRef}
                data={mapUrl}
                type="image/svg+xml"
                onLoad={handleMapLoad}
                style={{ pointerEvents: "none" }}
              >
                Your browser does not support SVG layers.
              </object>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default ZoomableMap;
