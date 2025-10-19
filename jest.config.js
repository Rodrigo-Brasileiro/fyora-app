const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // Caminhos de origem dos testes
  roots: ["<rootDir>/tests"],

  // Extensões que o Jest deve entender
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Transpila arquivos .ts e .tsx com ts-jest
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Expressão regular para localizar arquivos de teste
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$",

  // Mostra logs detalhados dos testes
  verbose: true,

  // Ignora node_modules e pastas de build
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],

  // Simula módulos do React Native (evita erro de imports)
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Limpa mocks automaticamente entre os testes
  clearMocks: true,
};
