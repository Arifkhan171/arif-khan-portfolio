/** Decorative hero background: faint grid and soft accent glow. CSS only, no animation. */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-70" />
      <div className="hero-glow absolute -top-48 -right-56 size-[44rem] max-w-none lg:-right-40" />
    </div>
  );
}
