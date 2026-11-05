import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, MotionConfig } from "motion/react";
import App from "./App";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { ErrorScreen } from "@/components/layout/ErrorScreen";
import { motionFailed, withReload } from "@/lib/chunkRecovery";
import { startRouter } from "@/lib/router";
import { loadCaseStudy } from "@/pages/loadCaseStudy";
import "@/styles/index.css";

// Hover/focus warm-up: a failure here must never reload the page.
startRouter(() => void loadCaseStudy().catch(() => {}));

// Animation code loads as its own small file. If it fails twice, the page is shown without animation.
const loadFeatures = () =>
  withReload(() => import("@/lib/motionFeatures"))()
    .then((module) => module.default)
    .catch((error: unknown) => {
      motionFailed();
      throw error;
    });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<ErrorScreen />}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </LazyMotion>
    </ErrorBoundary>
  </StrictMode>,
);
