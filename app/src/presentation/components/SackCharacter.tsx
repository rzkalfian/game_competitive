import illustration from "../../../public/images/balap-karung-chibi-hitam-elegan.svg?raw";

export function SackCharacter({
  color,
  animate,
  flipped,
}: {
  color: string;
  animate: boolean;
  flipped: boolean;
}) {
  const svg = illustration
    .replace("--shirt-main: #27272A;", `--shirt-main: ${color};`)
    .replace(
      "--shirt-shade: #18181B;",
      `--shirt-shade: color-mix(in srgb, ${color}, #261006 28%);`,
    )
    .replace(
      "--shirt-highlight: #575759;",
      `--shirt-highlight: color-mix(in srgb, ${color}, white 30%);`,
    )
    .replaceAll("infinite", "1")
    .replace(
      "</style>",
      `${animate ? "" : '[class*="anim-"] { animation: none !important; }'}
       .anim-dust-lines { opacity: 0; }
       @media (prefers-reduced-motion: reduce) {
         [class*="anim-"] { animation: none !important; }
       }
       </style>`,
    );

  return (
    <img
      className={`character sack-character ${flipped ? "flipped" : ""}`}
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
      alt="Karakter pemain balap karung"
    />
  );
}
