import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { HashRouter, Route, Routes } from "react-router";
import App from "./app/App";
import Landing from "./pages/landing/Landing";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Landing />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
