import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  addPath,
  addPathSync,
  getInput,
  getState,
  mustGetEnvironment,
  setEnv,
  setEnvSync,
  setOutput,
  setOutputSync,
  setState,
  setStateSync,
} from "./env.js";

const originalProcessEnv = { ...process.env };

beforeEach(() => {
  process.env = {};
});

describe("retrieve environment variables", () => {
  it("should retrieve an environment variable", () => {
    process.env.AN_ENV = "a value";
    expect(mustGetEnvironment("AN_ENV")).toBe("a value");
  });

  it("should fail to retrieve an undefined environment variable", () => {
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
    expect(getInput("an-undefined-input")).toBe("");
  });
});

describe("set GitHub Actions outputs", () => {
  const githubOutputFile = path.join(os.tmpdir(), "github_output");

  beforeEach(async () => {
    process.env.GITHUB_OUTPUT = githubOutputFile;
    await fsPromises.rm(githubOutputFile, { force: true });
  });

  it("should set GitHub Actions outputs", async () => {
    await Promise.all([
      setOutput("an-output", "a value"),
      setOutput("another-output", "another value"),
    ]);

    const content = await fsPromises.readFile(githubOutputFile, {
      encoding: "utf-8",
    });

    const lines = content
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

    const content = await fsPromises.readFile(githubOutputFile, {
      encoding: "utf-8",
    });

    expect(content).toBe(
      `an-output=a value${os.EOL}another-output=another value${os.EOL}`,
    );
  });

  afterAll(async () => {
    await fsPromises.rm(githubOutputFile, { force: true });
  });
});

describe("retrieve GitHub Actions states", () => {
  it("should retrieve a GitHub Actions state", () => {
    process.env["STATE_a-state"] = " a value  ";
    expect(getState("a-state")).toBe("a value");
  });

  it("should retrieve an undefined GitHub Actions state", () => {
    expect(getState("an-undefined-state")).toBe("");
  });
});

describe("set GitHub Actions states", () => {
  const githubStateFile = path.join(os.tmpdir(), "github_state");

  beforeEach(async () => {
    process.env.GITHUB_STATE = githubStateFile;
    await fsPromises.rm(githubStateFile, { force: true });
  });

  it("should set GitHub Actions states", async () => {
    await Promise.all([
      setState("a-state", "a value"),
      setState("another-state", "another value"),
    ]);

    expect(process.env).toEqual({
      GITHUB_STATE: githubStateFile,
      "STATE_a-state": "a value",
      "STATE_another-state": "another value",
    });

    const content = await fsPromises.readFile(githubStateFile, {
      encoding: "utf-8",
    });

    const lines = content
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();

    expect(lines).toEqual(["a-state=a value", "another-state=another value"]);
  });

  it("should set GitHub Actions states synchronously", async () => {
    setStateSync("a-state", "a value");
    setStateSync("another-state", "another value");

    expect(process.env).toEqual({
      GITHUB_STATE: githubStateFile,
      "STATE_a-state": "a value",
      "STATE_another-state": "another value",
    });

    const content = await fsPromises.readFile(githubStateFile, {
      encoding: "utf-8",
    });

    expect(content).toBe(
      `a-state=a value${os.EOL}another-state=another value${os.EOL}`,
    );
  });

  afterAll(async () => {
    await fsPromises.rm(githubStateFile, { force: true });
  });
});

describe("set environment variables in GitHub Actions", () => {
  const githubEnvFile = path.join(os.tmpdir(), "github_env");

  beforeEach(async () => {
    process.env.GITHUB_ENV = githubEnvFile;
    await fsPromises.rm(githubEnvFile, { force: true });
  });

  it("should set environment variables in GitHub Actions", async () => {
    await Promise.all([
      setEnv("AN_ENV", "a value"),
      setEnv("ANOTHER_ENV", "another value"),
    ]);

    expect(process.env).toEqual({
      GITHUB_ENV: githubEnvFile,
      AN_ENV: "a value",
      ANOTHER_ENV: "another value",
    });

    const content = await fsPromises.readFile(githubEnvFile, {
      encoding: "utf-8",
    });

    const lines = content
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();

    expect(lines).toEqual(["ANOTHER_ENV=another value", "AN_ENV=a value"]);
  });

  it("should set environment variables in GitHub Actions synchronously", async () => {
    setEnvSync("AN_ENV", "a value");
    setEnvSync("ANOTHER_ENV", "another value");

    expect(process.env).toEqual({
      GITHUB_ENV: githubEnvFile,
      AN_ENV: "a value",
      ANOTHER_ENV: "another value",
    });

    const content = await fsPromises.readFile(githubEnvFile, {
      encoding: "utf-8",
    });

    expect(content).toBe(
      `AN_ENV=a value${os.EOL}ANOTHER_ENV=another value${os.EOL}`,
    );
  });

  afterAll(async () => {
    await fsPromises.rm(githubEnvFile, { force: true });
  });
});

describe("adds system paths in GitHub Actions", () => {
  const githubPathFile = path.join(os.tmpdir(), "github_path");

  beforeEach(async () => {
    process.env.GITHUB_PATH = githubPathFile;
    await fsPromises.rm(githubPathFile, { force: true });
  });

  it("should add system paths in GitHub Actions", async () => {
    await Promise.all([addPath("a-path"), addPath("another-path")]);

    const sysPaths = (process.env.PATH ?? "").split(path.delimiter).sort();
    expect(sysPaths).toEqual(["a-path", "another-path"]);

    const content = await fsPromises.readFile(githubPathFile, {
      encoding: "utf-8",
    });

    const lines = content
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();
    expect(lines).toEqual(["a-path", "another-path"]);
  });

  it("should add system paths in GitHub Actions synchronously", async () => {
    addPathSync("a-path");
    addPathSync("another-path");

    const sysPaths = (process.env.PATH ?? "").split(path.delimiter);
    expect(sysPaths).toEqual(["another-path", "a-path"]);

    const content = await fsPromises.readFile(githubPathFile, {
      encoding: "utf-8",
    });

    expect(content).toBe(`a-path${os.EOL}another-path${os.EOL}`);
  });

  afterAll(async () => {
    await fsPromises.rm(githubPathFile, { force: true });
  });
});

afterAll(() => {
  process.env = originalProcessEnv;
});
