import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Arena } from "./Arena";

describe("arena tarik tambang", () => {
  it("menggeser pemain dan penanda sesuai selisih skor", () => {
    const markup = renderToStaticMarkup(
      <Arena type="rope" scores={[4, 2]} answerCounts={[1, 0]} playing />,
    );

    expect(markup).toContain("--rope-offset:-0.25");
    expect(markup).toContain("translateX(-18px)");
    expect(markup).toContain('class="rope-pull"');
  });

  it("menggeser penanda ke batas pemenang meskipun selisih skor kecil", () => {
    const markup = renderToStaticMarkup(
      <Arena type="rope" scores={[8, 7]} winner={0} />,
    );

    expect(markup).toContain("--rope-offset:-1");
    expect(markup).toContain("translateX(-72px)");
    expect(markup).not.toContain('class="rope-pull"');
  });

  it("menampilkan karakter pemanjat pada arena panjat pinang", () => {
    const markup = renderToStaticMarkup(
      <Arena
        type="pole"
        scores={[4, 2]}
        teamColors={["#3B82F6", "#EF4444"]}
        answerCounts={[4, 2]}
        playing
      />,
    );

    expect(markup).toContain('class="pole-climber"');
    expect(markup).toContain("data:image/svg+xml");
  });
});
