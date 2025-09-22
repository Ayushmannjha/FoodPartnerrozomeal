
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { analytics } from "./utils/analytics.ts";// Initialize analytics
analytics.init();

createRoot(document.getElementById("root")!).render(<App />);
  