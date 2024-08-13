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

### Logging Information

Information can be logged using the `logInfo` function:

```ts
logInfo("some information");
```

### Logging Errors

Errors can be logged using the `logError` function, which can log errors of any type. This is especially useful for logging caught errors:

```ts
try {
  // Do something
} catch (err) {
  logError(err);
}
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2024 [Alfi Maulana](https://github.com/threeal)
