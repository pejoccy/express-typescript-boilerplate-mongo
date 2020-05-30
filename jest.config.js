// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  "transform": {
    ".(ts|tsx)": "<rootDir>/test/preprocessor.js"
    // ".(ts|tsx)": "ts-jest"
  },
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  "testEnvironment": "node",
  "setupFilesAfterEnv": [ "./test/unit/lib/setup.ts" ]
}

