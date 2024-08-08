import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getInput, setOutput } from "./index.js";

describe("retrieve GitHub Actions inputs", () => {
  it("should retrieve a GitHub Actions input", () => {
    process.env["INPUT_SOME-INPUT"] = " some value  ";
    expect(getInput("some-input")).toBe("some value");
  });

  it("should retrieve an empty GitHub Actions input", () => {
    expect(getInput("some-empty-input")).toBe("");
  });
});

describe("set GitHub Actions outputs", () => {
  let tempFile: string;
  beforeAll(() => {
    tempFile = path.join(os.tmpdir(), "output");
    process.env["GITHUB_OUTPUT"] = tempFile;
    if (fs.existsSync(tempFile)) {
      fs.rmSync(tempFile);
    }
  });

  it("should set GitHub Actions outputs", () => {
    setOutput("some-output", "some value");
    setOutput("some-other-output", "some other value");

    expect(fs.readFileSync(tempFile, { encoding: "utf-8" })).toBe(
      `some-output=some value${os.EOL}some-other-output=some other value${os.EOL}`,
    );
  });

  afterAll(() => {
    if (fs.existsSync(tempFile)) {
      fs.rmSync(tempFile);
    }
  });
});
