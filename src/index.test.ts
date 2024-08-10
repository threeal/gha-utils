import { jest } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  beginLogGroup,
  endLogGroup,
  getInput,
  logError,
  logInfo,
  setOutput,
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

describe("log information in GitHub Actions", () => {
  it("should log an information message in GitHub Actions", () => {
    stdoutData = "";
    logInfo("some information message");
    expect(stdoutData).toBe(`some information message${os.EOL}`);
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
