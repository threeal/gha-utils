import { jest } from "@jest/globals";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  addPath,
  addPathSync,
  beginLogGroup,
  endLogGroup,
  getInput,
  logCommand,
  logError,
  logInfo,
  logWarning,
  setEnv,
  setEnvSync,
  setOutput,
  setOutputSync,
} from "./index.js";

let stdoutData: string;
beforeAll(() => {
  jest
    .spyOn(process.stdout, "write")
    .mockImplementation((str: string | Uint8Array): boolean => {
      stdoutData += str;
      return true;
    });
});

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
      setOutput("some-output", "some value"),
      setOutput("some-other-output", "some other value"),
    ]);

    const lines = (await fsPromises.readFile(tempFile, { encoding: "utf-8" }))
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();

    expect(lines).toEqual([
      "some-other-output=some other value",
      "some-output=some value",
    ]);
  });

  it("should set GitHub Actions outputs synchronously", async () => {
    setOutputSync("some-output", "some value");
    setOutputSync("some-other-output", "some other value");

    const content = await fsPromises.readFile(tempFile, { encoding: "utf-8" });
    expect(content).toBe(
      `some-output=some value${os.EOL}some-other-output=some other value${os.EOL}`,
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
      setEnv("SOME_ENV", "some value"),
      setEnv("SOME_OTHER_ENV", "some other value"),
    ]);

    expect(process.env.SOME_ENV).toBe("some value");
    expect(process.env.SOME_OTHER_ENV).toBe("some other value");

    const lines = (await fsPromises.readFile(tempFile, { encoding: "utf-8" }))
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();

    expect(lines).toEqual([
      "SOME_ENV=some value",
      "SOME_OTHER_ENV=some other value",
    ]);
  });

  it("should set environment variables in GitHub Actions synchronously", async () => {
    setEnvSync("SOME_ENV", "some value");
    setEnvSync("SOME_OTHER_ENV", "some other value");

    expect(process.env.SOME_ENV).toBe("some value");
    expect(process.env.SOME_OTHER_ENV).toBe("some other value");

    const content = await fsPromises.readFile(tempFile, { encoding: "utf-8" });
    expect(content).toBe(
      `SOME_ENV=some value${os.EOL}SOME_OTHER_ENV=some other value${os.EOL}`,
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
    await Promise.all([addPath("some-path"), addPath("some-other-path")]);

    const sysPaths = (process.env["PATH"] ?? "")
      .split(path.delimiter)
      .slice(0, 2)
      .sort();
    expect(sysPaths).toEqual(["some-other-path", "some-path"]);

    const lines = (await fsPromises.readFile(tempFile, { encoding: "utf-8" }))
      .split(os.EOL)
      .filter((line) => line !== "")
      .sort();
    expect(lines).toEqual(["some-other-path", "some-path"]);
  });

  it("should add system paths in GitHub Actions synchronously", async () => {
    addPathSync("some-path");
    addPathSync("some-other-path");

    const sysPaths = (process.env["PATH"] ?? "")
      .split(path.delimiter)
      .slice(0, 2);
    expect(sysPaths).toEqual(["some-other-path", "some-path"]);

    const content = await fsPromises.readFile(tempFile, { encoding: "utf-8" });
    expect(content).toBe(`some-path${os.EOL}some-other-path${os.EOL}`);
  });

  afterEach(async () => {
    try {
      await fsPromises.rm(tempFile);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  });
});

describe("log information in GitHub Actions", () => {
  it("should log an information message in GitHub Actions", () => {
    stdoutData = "";
    logInfo("some information message");
    expect(stdoutData).toBe(`some information message${os.EOL}`);
  });
});

describe("log warnings in GitHub Actions", () => {
  it("should log a warning message in GitHub Actions", () => {
    stdoutData = "";
    logWarning("some warning message");
    expect(stdoutData).toBe(`::warning::some warning message${os.EOL}`);
  });
});

describe("log errors in GitHub Actions", () => {
  it("should log an error message in GitHub Actions", () => {
    stdoutData = "";
    logError("some error message");
    expect(stdoutData).toBe(`::error::some error message${os.EOL}`);
  });

  it("should log an error object in GitHub Actions", () => {
    stdoutData = "";
    logError(new Error("some error object"));
    expect(stdoutData).toBe(`::error::some error object${os.EOL}`);
  });
});

describe("log commands in GitHub Actions", () => {
  it("should log a command in GitHub Actions", () => {
    stdoutData = "";
    logCommand("cmd", ["arg0", "arg1", "arg2"]);
    expect(stdoutData).toBe(`[command]cmd arg0 arg1 arg2${os.EOL}`);
  });
});

describe("begin and end log groups in GitHub Actions", () => {
  it("should begin a log group in GitHub Actions", () => {
    stdoutData = "";
    beginLogGroup("some log group");
    expect(stdoutData).toBe(`::group::some log group${os.EOL}`);
  });

  it("should end the current log group in GitHub Actions", () => {
    stdoutData = "";
    endLogGroup();
    expect(stdoutData).toBe(`::endgroup::${os.EOL}`);
  });
});
