/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*?react" {
  import type React from "react";

  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
