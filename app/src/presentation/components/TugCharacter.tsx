import illustration from "../../../public/images/tarik-tambang-baju-merah-merdeka.svg?raw";

export function TugCharacter({
  color,
  animate,
}: {
  color: string;
  animate: boolean;
}) {
  const svg = illustration
    .replace(
      /<g id="layer-rope-front" class="anim-rope-tense">[\s\S]*?<\/g>/,
      "",
    )
    .replace("--shirt-main: #D92B2B;", `--shirt-main: ${color};`)
    .replace(
      "--shirt-shade: #B01E1E;",
      `--shirt-shade: color-mix(in srgb, ${color}, #2C1A12 28%);`,
    )
    .replace(
      "--shirt-highlight: #E84545;",
      `--shirt-highlight: color-mix(in srgb, ${color}, white 30%);`,
    )
    .replaceAll("ease-in-out infinite", "ease-in-out 1")
    .replace(
      "</style>",
      `${animate ? "" : '[class*="anim-"] { animation: none !important; }'}
       @media (prefers-reduced-motion: reduce) {
         [class*="anim-"] { animation: none !important; }
       }
       </style>`,
    );

  return (
    <img
      className="tug-character"
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
      alt=""
      aria-hidden="true"
    />
  );
}
