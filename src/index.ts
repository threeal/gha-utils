import fs from "node:fs";
import os from "node:os";

/**
 * Retrieves the value of a GitHub Actions input.
 *
 * @param name - The name of the GitHub Actions input.
 * @returns The value of the GitHub Actions input, or an empty string if not found.
 */
export function getInput(name: string): string {
  const value = process.env[`INPUT_${name.toUpperCase()}`] || "";
  return value.trim();
}

/**
 * Sets the value of a GitHub Actions output.
 *
 * @param name - The name of the GitHub Actions output.
 * @param value - The value of the GitHub Actions output
 */
export function setOutput(name: string, value: string): void {
  fs.appendFileSync(
    process.env["GITHUB_OUTPUT"] as string,
    `${name}=${value}${os.EOL}`,
  );
}

/**
 * Logs an information message in GitHub Actions.
 *
 * @param message - The information message to log.
 */
export function logInfo(message: string): void {
  process.stdout.write(`${message}${os.EOL}`);
}

/**
 * Logs an error message in GitHub Actions.
 *
 * @param err - The error, which can be of any type.
 */
export function logError(err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  process.stdout.write(`::error::${message}${os.EOL}`);
}
