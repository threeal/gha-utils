# GitHub Actions Utilities

A minimalistic utility package for developing [GitHub Actions](https://github.com/features/actions).

## Key Features

- ES Module support
- Getting inputs and setting outputs
- Setting environment variables and appending system paths
- Logging various kinds of messages

## Usage Guide

### Getting Inputs and Setting Outputs

GitHub Actions inputs can be retrieved using the `getInput` function, which returns a trimmed string or an empty string if the input is not specified. GitHub Actions outputs can be set using the `setOutput` function:

```ts
const input = getInput("input-name");

setOutput("output-name", "some value");
```

### Setting Environment Variables

Environment variables in GitHub Actions can be set using the `setEnv` function, which sets the environment variables in the current step and exports them to the next steps:

```ts
setEnv("SOME_ENV", "some value");
```

### Adding System Paths

System paths in the GitHub Actions environment can be added using the `addPath` function, which prepends the given path to the system path. This function is useful if an action is adding a new executable located in a custom path:

```ts
addPath("path/to/some/executable");
```

### Logging Messages

There are various ways to log messages in GitHub Actions, including `logInfo` for logging an informational message, `logWarning` for logging a warning message, `logError` for logging an error message, and `logCommand` for logging a command line message:

```ts
try {
  logInfo("some information");
  logWarning("some warning");
  logCommand("command", ["arg0", "arg1", "arg2"]);
} catch (err) {
  logError(err);
}
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2024 [Alfi Maulana](https://github.com/threeal)
