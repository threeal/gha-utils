import { jest } from "@jest/globals";
import os from "node:os";

import {
  beginLogGroup,
  endLogGroup,
  logCommand,
  logError,
  logInfo,
  logWarning,
} from "./log.js";

let stdoutData: string;
beforeAll(() => {
  jest
    .spyOn(process.stdout, "write")
    .mockImplementation((str: string | Uint8Array): boolean => {
      stdoutData += str;
      return true;
    });
});

describe("log information in GitHub Actions", () => {
  it("should log an information message in GitHub Actions", () => {
    stdoutData = "";
    logInfo("an information message");
    expect(stdoutData).toBe(`an information message${os.EOL}`);
  });
});

describe("log warnings in GitHub Actions", () => {
  it("should log a warning message in GitHub Actions", () => {
    stdoutData = "";
    logWarning("a warning message");
    expect(stdoutData).toBe(`::warning::a warning message${os.EOL}`);
  });
});

describe("log errors in GitHub Actions", () => {
  it("should log an error message in GitHub Actions", () => {
    stdoutData = "";
    logError("an error message");
    expect(stdoutData).toBe(`::error::an error message${os.EOL}`);
  });

  it("should log an error object in GitHub Actions", () => {
    stdoutData = "";
    logError(new Error("an error object"));
    expect(stdoutData).toBe(`::error::an error object${os.EOL}`);
  });
});

describe("log commands in GitHub Actions", () => {
  it("should log a command in GitHub Actions", () => {
    stdoutData = "";
    logCommand("cmd", "arg0", "arg1", "arg2");
    expect(stdoutData).toBe(`[command]cmd arg0 arg1 arg2${os.EOL}`);
  });
});

describe("begin and end log groups in GitHub Actions", () => {
  it("should begin a log group in GitHub Actions", () => {
    stdoutData = "";
    beginLogGroup("a log group");
    expect(stdoutData).toBe(`::group::a log group${os.EOL}`);
  });

  it("should end the current log group in GitHub Actions", () => {
    stdoutData = "";
    endLogGroup();
    expect(stdoutData).toBe(`::endgroup::${os.EOL}`);
  });
});
