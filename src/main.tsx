import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/list-customization.css";
import "./services/mockApi";

createRoot(document.getElementById("root")!).render(<App />);
