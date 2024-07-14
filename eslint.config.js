import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: ["import"],
    rules: {
      "import/extensions": ["error", "ignorePackages"],
      "import/no-unresolved": "off",
      "import/prefer-default-export": "off",
    },
  },
  {
    rules: {
      indent: ["off", "tab"],
      "no-tabs": 0,
      quotes: ["error", "single"],
      semi: ["error", "never"],
      "import/no-default-export": "error",
    },
  },
];
