/**
 * Visible dot between parts of an inline line; screen readers get a comma pause instead.
 * The trailing space is the only place the line may wrap, so each part stays whole.
 */
export function InlineSep() {
  return (
    <>
      <span aria-hidden="true" className="ml-1.5">
        ·
      </span>
      <span className="sr-only">, </span>{" "}
    </>
  );
}
