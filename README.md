# GitHub Actions Utilities

A minimalistic utility package for developing [GitHub Actions](https://github.com/features/actions).

## Key Features

- ES Module support.
- Getting inputs and setting outputs.
- Logging information and errors.

## Usage Guide

### Getting Inputs

GitHub Actions inputs can be retrieved using the `getInput` function, which will return a trimmed string or an empty string if the input is not specified:

```ts
const input = getInput("input-name");
```

### Setting Outputs

GitHub Actions outputs can be set using the `setOutput` function:

```ts
setOutput("output-name", "some value");
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
