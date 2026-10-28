import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import App from "./App";
import { startRouter } from "@/lib/router";
import { loadCaseStudy } from "@/pages/loadCaseStudy";
import "@/styles/index.css";

startRouter(() => void loadCaseStudy());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
);
