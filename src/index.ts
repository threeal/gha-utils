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
