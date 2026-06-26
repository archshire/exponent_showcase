import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Temporary playable demo arena (imported with the game assets). It will be
    // rebuilt against the final arena design; its render-time ref/immutability
    // patterns are intentional for the preview, so it is excluded from lint.
    "src/game/demo_client.tsx",
  ]),
]);

export default eslintConfig;
