import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Catch hardcoded UI strings — force all user-facing text through next-intl.
  // Allows: prop strings, attributes, and short technical literals.
  // Catches: text inside JSX elements like <h1>Datum</h1> or <p>Gratis</p>.
  {
    files: ["src/app/**/*.tsx", "src/components/**/*.tsx"],
    ignores: ["src/components/illustrations/**"],
    rules: {
      "react/jsx-no-literals": [
        "warn",
        {
          noStrings: true,
          allowedStrings: [
            "·", "→", "←", "✕", "—", " — ", " · ", ":", ": ",
            "📍", "🕐", "💡", "🏠", "🎯", "📅", "🌷",
            "Berry Kids", "NL", "EN", "Berry",
            "Tip",
          ],
          ignoreProps: true,
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
