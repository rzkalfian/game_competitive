import source from "../../../public/icons/kode_animasi_panjat_pinang?raw";

function extractGroup(svg: string, id: string) {
  const opening = svg.match(new RegExp(`<g[^>]*id="${id}"[^>]*>`));
  if (!opening) return "";
  const indexStart = opening.index;
  if (typeof indexStart !== "number") return "";
  let depth = 0;
  let index = indexStart;
  if (index < 0) return "";
  for (; index < svg.length; index += 1) {
    if (svg.startsWith("<g", index)) depth += 1;
    if (svg.startsWith("</g>", index)) {
      depth -= 1;
      if (depth === 0) {
        return svg.slice(indexStart, index + 4);
      }
    }
  }
  return "";
}

export function PoleClimber({
  color,
  animate,
}: {
  color: string;
  animate: boolean;
}) {
  let svg = extractGroup(source, "climber-master-group");
  if (!svg) return null;

  svg = svg
    .replaceAll("#FFFFFF", "#FFFFFF")
    .replaceAll("var(--shirt-main)", color)
    .replaceAll("var(--shirt-shade)", `color-mix(in srgb, ${color}, #2D1606 28%)`)
    .replaceAll("var(--shirt-highlight)", `color-mix(in srgb, ${color}, white 35%)`)
    .replaceAll("var(--skin-main)", "#F3C29B")
    .replaceAll("var(--outline)", "#2D1606")
    .replaceAll("var(--hair-main)", "#3E2212");

  const motion = animate
    ? ""
    : `[class^="anim-"], [class*=" anim-"] { animation: none !important; }`;
  const standalone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="80 210 190 270" width="190" height="270">
    <defs><style>
      ${source.includes("@keyframes masterClimbMotion")
        ? "@keyframes masterClimbMotion{0%,100%{transform:translateY(0)}35%{transform:translateY(-13px)}65%{transform:translateY(-20px)}85%{transform:translateY(-3px)}}"
        : ""}
      ${source.includes("@keyframes bodyFlexSmooth")
        ? "@keyframes bodyFlexSmooth{0%,100%{transform:rotate(0)}35%{transform:rotate(1.3deg)}65%{transform:rotate(1.6deg)}}"
        : ""}
      .anim-master-climber{animation:masterClimbMotion 2.4s ease-in-out 1}
      .anim-torso-unit{transform-origin:175px 380px;animation:bodyFlexSmooth 2.4s ease-in-out 1}
      .shirt-fill{fill:${color}}
      .shorts-fill{fill:#171717}
      .shorts-shade-fill{fill:#0A0A0A}
      ${motion}
    </style></defs>
    ${svg}
  </svg>`;

  return (
    <img
      className="pole-climber"
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(standalone)}`}
      alt=""
      aria-hidden="true"
    />
  );
}
