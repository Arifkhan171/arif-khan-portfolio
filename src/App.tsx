import { motion } from "motion/react";
import { fadeIn } from "@/lib/animations";

// Placeholder content. Hard-coded text is allowed here only; later specs replace it.
export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <motion.div {...fadeIn}>
        <h1 className="text-3xl font-semibold sm:text-5xl">Arif Khan — Portfolio</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">Coming soon</p>
      </motion.div>
    </main>
  );
}
