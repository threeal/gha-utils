import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  addPath,
  addPathSync,
  getInput,
  mustGetEnvironment,
  setEnv,
  setEnvSync,
  setOutput,
  setOutputSync,
  setState,
} from "./env.js";

describe("retrieve environment variables", () => {
  it("should retrieve an environment variable", () => {
    process.env["AN_ENV"] = "a value";
    expect(mustGetEnvironment("AN_ENV")).toBe("a value");
  });

  it("should fail to retrieve an undefined environment variable", () => {
    delete process.env["AN_UNDEFINED_ENV"];
    expect(() => mustGetEnvironment("AN_UNDEFINED_ENV")).toThrow(
      "the AN_UNDEFINED_ENV environment variable must be defined",
    );
  });
});

describe("retrieve GitHub Actions inputs", () => {
  it("should retrieve a GitHub Actions input", () => {
    process.env["INPUT_AN-INPUT"] = " a value  ";
    expect(getInput("an-input")).toBe("a value");
  });

  it("should retrieve an undefined GitHub Actions input", () => {
    delete process.env["INPUT_AN-UNDEFINED-INPUT"];
    expect(getInput("an-undefined-input")).toBe("");
  });
});

describe("set GitHub Actions outputs", () => {
  let tempFile: string;
  beforeEach(async () => {
    tempFile = path.join(os.tmpdir(), "output");
    process.env["GITHUB_OUTPUT"] = tempFile;
    try {
      await fsPromises.rm(tempFile);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  });

  it("should set GitHub Actions outputs", async () => {
    await Promise.all([
      setOutput("an-output", "a value"),
      setOutput("another-output", "another value"),
    ]);

    const lines = (await fsPromises.readFile(tempFile, { encoding: "utf-8" }))
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();

    expect(lines).toEqual([
      "an-output=a value",
      "another-output=another value",
    ]);
  });

  it("should set GitHub Actions outputs synchronously", async () => {
    setOutputSync("an-output", "a value");
    setOutputSync("another-output", "another value");

    const content = await fsPromises.readFile(tempFile, { encoding: "utf-8" });
    expect(content).toBe(
      `an-output=a value${os.EOL}another-output=another value${os.EOL}`,
    );
  });

  afterEach(async () => {
    try {
      await fsPromises.rm(tempFile);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  });
});

describe("set GitHub Actions states", () => {
  let tempFile: string;
  beforeEach(async () => {
    tempFile = path.join(os.tmpdir(), "state");
    process.env["GITHUB_STATE"] = tempFile;
    try {
      await fsPromises.rm(tempFile);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  });

  it("should set GitHub Actions states", async () => {
    await Promise.all([
      setState("a-state", "a value"),
      setState("another-state", "another value"),
    ]);

    const lines = (await fsPromises.readFile(tempFile, { encoding: "utf-8" }))
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();

    expect(lines).toEqual(["a-state=a value", "another-state=another value"]);
  });

  afterEach(async () => {
    try {
      await fsPromises.rm(tempFile);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  });
});

describe("set environment variables in GitHub Actions", () => {
  let tempFile: string;
  beforeEach(async () => {
    tempFile = path.join(os.tmpdir(), "env");
    process.env["GITHUB_ENV"] = tempFile;
    try {
      await fsPromises.rm(tempFile);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  });

  it("should set environment variables in GitHub Actions", async () => {
    await Promise.all([
      setEnv("AN_ENV", "a value"),
      setEnv("ANOTHER_ENV", "another value"),
    ]);

    expect(process.env.AN_ENV).toBe("a value");
    expect(process.env.ANOTHER_ENV).toBe("another value");

    const lines = (await fsPromises.readFile(tempFile, { encoding: "utf-8" }))
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();

    expect(lines).toEqual(["ANOTHER_ENV=another value", "AN_ENV=a value"]);
  });

  it("should set environment variables in GitHub Actions synchronously", async () => {
    setEnvSync("AN_ENV", "a value");
    setEnvSync("ANOTHER_ENV", "another value");

    expect(process.env.AN_ENV).toBe("a value");
    expect(process.env.ANOTHER_ENV).toBe("another value");

    const content = await fsPromises.readFile(tempFile, { encoding: "utf-8" });
    expect(content).toBe(
      `AN_ENV=a value${os.EOL}ANOTHER_ENV=another value${os.EOL}`,
    );
  });

  afterEach(async () => {
    try {
      await fsPromises.rm(tempFile);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  });
});

describe("adds system paths in GitHub Actions", () => {
  let tempFile: string;
  beforeEach(async () => {
    tempFile = path.join(os.tmpdir(), "path");
    process.env["GITHUB_PATH"] = tempFile;
    try {
      await fsPromises.rm(tempFile);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  });

  it("should add system paths in GitHub Actions", async () => {
    await Promise.all([addPath("a-path"), addPath("another-path")]);

    const sysPaths = (process.env["PATH"] ?? "")
      .split(path.delimiter)
      .slice(0, 2)
      .sort();
    expect(sysPaths).toEqual(["a-path", "another-path"]);

    const lines = (await fsPromises.readFile(tempFile, { encoding: "utf-8" }))
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();
    expect(lines).toEqual(["a-path", "another-path"]);
  });

  it("should add system paths in GitHub Actions synchronously", async () => {
    addPathSync("a-path");
    addPathSync("another-path");

    const sysPaths = (process.env["PATH"] ?? "")
      .split(path.delimiter)
      .slice(0, 2);
    expect(sysPaths).toEqual(["another-path", "a-path"]);

    const content = await fsPromises.readFile(tempFile, { encoding: "utf-8" });
    expect(content).toBe(`a-path${os.EOL}another-path${os.EOL}`);
  });

  afterEach(async () => {
    try {
      await fsPromises.rm(tempFile);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  });
});
