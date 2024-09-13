import os from "node:os";

export {
  addPath,
  addPathSync,
  getInput,
  setEnv,
  setEnvSync,
  setOutput,
  setOutputSync,
} from "./env.js";

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
export function logCommand(command: string, ...args: string[]): void {
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
