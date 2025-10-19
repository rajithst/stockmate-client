import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettierConfig from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      react.configs.recommended,
      "plugin:react-hooks/recommended",
      "plugin:react-refresh/recommended",
      prettierConfig
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      parserOptions: {
          project: true,
          tsconfigRootDir: import.meta.dirname,
      }
    }
  },
])
