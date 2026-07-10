// Shown only on phone-sized landscape viewports (see .rotate-portrait-overlay in
// globals.css). A real orientation lock isn't available to a normal browser tab,
// so we ask the user to rotate rather than forcing it.
export function RotateToPortrait() {
  return (
    <div
      className="rotate-portrait-overlay fixed inset-0 z-[100] flex-col items-center justify-center gap-4 bg-[var(--background)] px-8 text-center"
      role="alertdialog"
      aria-label="Please rotate your device to portrait"
    >
      <div className="text-5xl animate-countdown-pulse" aria-hidden>
        📱
      </div>
      <p className="text-lg font-semibold">Please rotate your device</p>
      <p className="max-w-xs text-sm text-[var(--muted)]">
        TriviaWorld plays best upright. Turn your phone to portrait mode to keep
        playing.
      </p>
    </div>
  );
}
