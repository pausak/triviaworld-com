import { describe, expect, it } from "vitest";
import { categoryFromParam, difficultyFromParam } from "@/lib/deepLink";
import { categories } from "@/lib/categories";

describe("categoryFromParam", () => {
  it("resolves every curated category, not just the ones in the picker", () => {
    for (const c of categories) {
      expect(categoryFromParam(String(c.openTdbId))).toEqual({ id: c.openTdbId, name: c.shortName });
    }
  });

  it("ignores what is missing, unknown or not a number", () => {
    expect(categoryFromParam(null)).toBeNull();
    expect(categoryFromParam("")).toBeNull();
    expect(categoryFromParam("abc")).toBeNull();
    expect(categoryFromParam("999999")).toBeNull();
  });
});

describe("difficultyFromParam", () => {
  it("accepts the three levels and nothing else", () => {
    expect(difficultyFromParam("hard")).toBe("hard");
    expect(difficultyFromParam("HARD")).toBeNull();
    expect(difficultyFromParam("impossible")).toBeNull();
    expect(difficultyFromParam(null)).toBeNull();
  });
});
