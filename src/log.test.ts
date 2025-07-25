import os from "node:os";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  beginLogGroup,
  endLogGroup,
  logCommand,
  logDebug,
  logError,
  logInfo,
  logWarning,
} from "./log.js";

let stdoutData: string;
vi.spyOn(process.stdout, "write").mockImplementation((buffer) => {
  if (typeof buffer === "string") stdoutData += buffer;
  return true;
});

beforeEach(() => {
  stdoutData = "";
});

describe("log information in GitHub Actions", () => {
  it("should log an information message in GitHub Actions", () => {
    logInfo("an information message");
    expect(stdoutData).toBe(`an information message${os.EOL}`);
  });
});

describe("log debugs in GitHub Actions", () => {
  it("should log a debug message in GitHub Actions", () => {
    logDebug("a debug message");
    expect(stdoutData).toBe(`::debug::a debug message${os.EOL}`);
  });
});

describe("log warnings in GitHub Actions", () => {
  it("should log a warning message in GitHub Actions", () => {
    logWarning("a warning message");
    expect(stdoutData).toBe(`::warning::a warning message${os.EOL}`);
  });
});

describe("log errors in GitHub Actions", () => {
  it("should log an error message in GitHub Actions", () => {
    logError("an error message");
    expect(stdoutData).toBe(`::error::an error message${os.EOL}`);
  });

  it("should log an error object in GitHub Actions", () => {
    logError(new Error("an error object"));
    expect(stdoutData).toBe(`::error::an error object${os.EOL}`);
  });
});

describe("log commands in GitHub Actions", () => {
  it("should log a command in GitHub Actions", () => {
    logCommand("cmd", "arg0", "arg1", "arg2");
    expect(stdoutData).toBe(`[command]cmd arg0 arg1 arg2${os.EOL}`);
  });
});

describe("begin and end log groups in GitHub Actions", () => {
  it("should begin a log group in GitHub Actions", () => {
    beginLogGroup("a log group");
    expect(stdoutData).toBe(`::group::a log group${os.EOL}`);
  });

  it("should end the current log group in GitHub Actions", () => {
    endLogGroup();
    expect(stdoutData).toBe(`::endgroup::${os.EOL}`);
  });
});
