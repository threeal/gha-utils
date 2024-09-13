import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * Retrieves the value of an environment variable.
 *
 * @param name - The name of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is not defined.
 */
export function mustGetEnvironment(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`the ${name} environment variable must be defined`);
  }
  return value;
}

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
 * @param value - The value to set for the GitHub Actions output.
 * @returns A promise that resolves when the value is successfully set.
 */
export async function setOutput(name: string, value: string): Promise<void> {
  const filePath = mustGetEnvironment("GITHUB_OUTPUT");
  await fsPromises.appendFile(filePath, `${name}=${value}${os.EOL}`);
}

/**
 * Sets the value of a GitHub Actions output synchronously.
 *
 * @param name - The name of the GitHub Actions output.
 * @param value - The value to set for the GitHub Actions output.
 */
export function setOutputSync(name: string, value: string): void {
  const filePath = mustGetEnvironment("GITHUB_OUTPUT");
  fs.appendFileSync(filePath, `${name}=${value}${os.EOL}`);
}

/**
 * Sets the value of an environment variable in GitHub Actions.
 *
 * @param name - The name of the environment variable.
 * @param value - The value to set for the environment variable.
 * @returns A promise that resolves when the environment variable is
 *          successfully set.
 */
export async function setEnv(name: string, value: string): Promise<void> {
  process.env[name] = value;
  const filePath = mustGetEnvironment("GITHUB_ENV");
  await fsPromises.appendFile(filePath, `${name}=${value}${os.EOL}`);
}

/**
 * Sets the value of an environment variable in GitHub Actions synchronously.
 *
 * @param name - The name of the environment variable.
 * @param value - The value to set for the environment variable.
 */
export function setEnvSync(name: string, value: string): void {
  process.env[name] = value;
  const filePath = mustGetEnvironment("GITHUB_ENV");
  fs.appendFileSync(filePath, `${name}=${value}${os.EOL}`);
}

/**
 * Adds a system path to the environment in GitHub Actions.
 *
 * @param sysPath - The system path to add to the environment.
 * @returns A promise that resolves when the system path is successfully added.
 */
export async function addPath(sysPath: string): Promise<void> {
  process.env["PATH"] = `${sysPath}${path.delimiter}${process.env["PATH"]}`;
  const filePath = mustGetEnvironment("GITHUB_PATH");
  await fsPromises.appendFile(filePath, `${sysPath}${os.EOL}`);
}

/**
 * Adds a system path to the environment in GitHub Actions synchronously.
 *
 * @param sysPath - The system path to add to the environment.
 */
export function addPathSync(sysPath: string): void {
  process.env["PATH"] = `${sysPath}${path.delimiter}${process.env["PATH"]}`;
  const filePath = mustGetEnvironment("GITHUB_PATH");
  fs.appendFileSync(filePath, `${sysPath}${os.EOL}`);
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
 * Logs a warning message in GitHub Actions.
 *
 * @param message - The warning message to log.
 */
export function logWarning(message: string): void {
  process.stdout.write(`::warning::${message}${os.EOL}`);
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

/**
 * Logs a command along with its arguments in GitHub Actions.
 *
 * @param command - The command to log.
 * @param args - The arguments of the command.
 */
export function logCommand(command: string, args: readonly string[]): void {
  const message = [command, ...args].join(" ");
  process.stdout.write(`[command]${message}${os.EOL}`);
}

/**
 * Begins a log group in GitHub Actions.
 *
 * @param name - The name of the log group.
 */
export function beginLogGroup(name: string): void {
  process.stdout.write(`::group::${name}${os.EOL}`);
}

/**
 * Ends the current log group in GitHub Actions.
 */
export function endLogGroup(): void {
  process.stdout.write(`::endgroup::${os.EOL}`);
}
