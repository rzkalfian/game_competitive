import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Character } from "./Character";

function renderSack(animate = false) {
  const markup = renderToStaticMarkup(
    <Character color="#3B82F6" sack animate={animate} />,
  );
  const source = markup.match(/src="data:image\/svg\+xml;charset=utf-8,([^"]+)"/);
  if (!source) throw new Error("Gambar karakter balap karung tidak dirender.");
  return decodeURIComponent(source[1]);
}

describe("karakter balap karung", () => {
  it("memakai ilustrasi lengkap dengan warna pemain dan clip path yang utuh", () => {
    const svg = renderSack();
    expect(svg).toContain('id="jumper-master-group"');
    expect(svg).toContain('id="sack-body-clip"');
    expect(svg).toContain("--shirt-main: #3B82F6;");
    expect(svg.trim()).toMatch(/<\/svg>$/);
  });

  it("diam saat preview dan memutar lompatan sekali saat menjawab", () => {
    expect(renderSack()).toContain('[class*="anim-"] { animation: none !important; }');
    const animated = renderSack(true);
    expect(animated).not.toContain(" infinite");
    expect(animated).toContain("cubic-bezier(0.36, 0, 0.64, 1) 1");
    expect(animated).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
