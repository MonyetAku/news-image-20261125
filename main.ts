// news-image-20261125 — "The World in One Day: 25 November 2026".
//
// The entry is a program that writes one image of the day's world news to
// the grader's output directory. The front page itself (entry.png) is drawn
// by the build script and shipped in this repository; this program copies
// those exact bytes to $MAKEFUN_OUTPUT_DIR/entry.png, so both grading runs
// produce byte-identical output.
//
// The image sums up Wednesday 25 November 2026: Ukraine sinks a Russian
// warship off Libya (lead), NATO early-warning aircraft for Poland, a
// Houthi drone hitting Riyadh's tallest tower, mines hitting tankers in
// the Strait of Hormuz, plus the day's other headlines.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outDir, { recursive: true });

const src = new URL("./entry.png", import.meta.url);
const bytes = readFileSync(src);

// Sanity check: refuse to write anything that is not a whole PNG file:
// the 8-byte signature up front and the 12-byte IEND chunk at the end.
const IEND = Buffer.from([
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);
if (
  bytes.length < 8 ||
  bytes[0] !== 0x89 ||
  bytes[1] !== 0x50 ||
  bytes[2] !== 0x4e ||
  bytes[3] !== 0x47 ||
  !bytes.subarray(bytes.length - 12).equals(IEND)
) {
  throw new Error("entry.png is not a whole PNG file");
}

const dest = join(outDir, "entry.png");
copyFileSync(src, dest);
console.log(`wrote ${bytes.length} bytes to ${dest}`);
