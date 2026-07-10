import { RotateToPortrait } from "@/components/RotateToPortrait";

// Wraps every /play route. Adds the rotate-to-portrait prompt for phones held
// in landscape, where the timed question view is cramped.
export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <RotateToPortrait />
    </>
  );
}
