# GitHub Actions Utilities

A minimalistic utility package for developing [GitHub Actions](https://github.com/features/actions).

## Key Features

- ES Module support.
- Getting inputs and setting outputs.
- Logging errors.

## Usage Guide

### Getting Inputs

GitHub Actions inputs can be retrieved using the `getInput` function, which will return a trimmed string or an empty string if the input is not specified:

```ts
const input = getInput("input-name");
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2024 [Alfi Maulana](https://github.com/threeal)
