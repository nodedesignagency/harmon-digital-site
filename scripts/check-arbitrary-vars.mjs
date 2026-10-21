#!/usr/bin/env node
/**
 * Guards against `prop-[--token]` — Tailwind v4's bracket syntax requires a
 * complete CSS value, so a bare custom-property name silently compiles to an
 * invalid declaration and the browser drops it. The fix is the var()-shorthand
 * form, `prop-(--token)`.
 *
 * This class of bug is invisible to every other check in this project: tsc
 * doesn't parse Tailwind classes, and grepping rendered HTML only confirms the
 * class name is present, not that it resolves to anything once parsed. It
 * shipped silently across the whole codebase for exactly that reason. Run as
 * part of `npm run lint`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Every .ts, .tsx and .css file under src/, read from disk. It used to ask
// `git ls-files`, and a copy of the project without its git history — the
// zip a client is handed — failed `npm run lint` right here, before checking
// anything. From disk it also sees a new file before it is committed.
const files = readdirSync("src", { recursive: true })
  .map(String)
  .filter((file) => /\.(tsx?|css)$/.test(file))
  .map((file) => join("src", file));

const pattern = /-\[(--[a-zA-Z0-9-]+)\]/g;
let failures = 0;

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const match of line.matchAll(pattern)) {
      failures += 1;
      console.error(
        `${file}:${i + 1}: bare custom property in brackets — ` +
          `\`${match[0]}\` compiles to an invalid CSS value. ` +
          `Use \`-(${match[1]})\` instead.`,
      );
    }
  });
}

if (failures > 0) {
  console.error(`\n${failures} arbitrary-value violation(s) found.`);
  process.exit(1);
}
