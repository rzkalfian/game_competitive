import { SackCharacter } from "./SackCharacter";

export function Character({
  color,
  sack = false,
  flipped = false,
  animate = false,
}: {
  color: string;
  sack?: boolean;
  flipped?: boolean;
  animate?: boolean;
}) {
  if (sack) return <SackCharacter color={color} animate={animate} flipped={flipped} />;
  return (
    <svg
      viewBox="0 0 100 140"
      role="img"
      aria-label="Karakter pemain"
      className={`character ${flipped ? "flipped" : ""}`}
    >
      <g
        stroke="#283c32"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M37 88 30 121 18 125M61 88 69 121 80 124" fill="none" />
        <path
          d="M29 60 13 78M70 61 85 49"
          fill="none"
          stroke="#d79469"
          strokeWidth="10"
        />
        <path d="M33 53 67 53 72 94 28 94Z" fill={color} />
        <path d="m40 53 10 12 10-12" fill="#fff" />
        <ellipse cx="50" cy="31" rx="22" ry="25" fill="#e9ab7c" />
        <path d="M28 27c-1-31 45-28 45 0L59 14l-8 6-12-5Z" fill="#283c32" />
        <path d="M42 32v2m16-2v2m-14 9q6 6 12 0" fill="none" />
      </g>
    </svg>
  );
}
