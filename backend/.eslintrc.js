module.exports = {
    root: true,
    env: {
        node: true,
        es2021: true,
        jest: true,
    },
    parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
    },
    extends: [
        "eslint:recommended",
        "plugin:node/recommended",
        "plugin:prettier/recommended" // включает eslint-config-prettier и eslint-plugin-prettier
    ],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": "error",
        "no-console": "off",
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
};
