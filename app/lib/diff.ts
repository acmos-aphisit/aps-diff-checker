import { diffLines } from "diff";

export type RowType = "unchanged" | "added" | "removed" | "modified";

export interface DiffRow {
  left: string | null;
  right: string | null;
  type: RowType;
  leftLineNo: number | null;
  rightLineNo: number | null;
}

/**
 * Splits a diff-chunk's raw text into individual lines, dropping the
 * trailing empty element that split("\n") leaves behind when the chunk
 * ends with a newline.
 */
function splitLines(value: string): string[] {
  const lines = value.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  return lines;
}

/**
 * Builds an aligned, two-column, line-by-line diff between two blocks of
 * text. Runs of removed lines immediately followed by a run of added lines
 * are paired up index-for-index as "modified" rows (mirroring how most
 * side-by-side diff tools present a replaced block); any leftover lines on
 * either side become pure removed/added rows.
 */
export function buildSideBySideDiff(original: string, changed: string): DiffRow[] {
  const parts = diffLines(original, changed);
  const rows: DiffRow[] = [];
  let leftLineNo = 1;
  let rightLineNo = 1;

  let i = 0;
  while (i < parts.length) {
    const part = parts[i];

    if (!part.added && !part.removed) {
      for (const line of splitLines(part.value)) {
        rows.push({
          left: line,
          right: line,
          type: "unchanged",
          leftLineNo: leftLineNo++,
          rightLineNo: rightLineNo++,
        });
      }
      i++;
      continue;
    }

    if (part.removed) {
      const removedLines = splitLines(part.value);
      const next = parts[i + 1];

      if (next && next.added) {
        const addedLines = splitLines(next.value);
        const max = Math.max(removedLines.length, addedLines.length);

        for (let j = 0; j < max; j++) {
          const hasLeft = j < removedLines.length;
          const hasRight = j < addedLines.length;
          rows.push({
            left: hasLeft ? removedLines[j] : null,
            right: hasRight ? addedLines[j] : null,
            type: hasLeft && hasRight ? "modified" : hasLeft ? "removed" : "added",
            leftLineNo: hasLeft ? leftLineNo++ : null,
            rightLineNo: hasRight ? rightLineNo++ : null,
          });
        }
        i += 2;
        continue;
      }

      for (const line of removedLines) {
        rows.push({
          left: line,
          right: null,
          type: "removed",
          leftLineNo: leftLineNo++,
          rightLineNo: null,
        });
      }
      i++;
      continue;
    }

    // part.added, with no preceding removed run already consumed above
    for (const line of splitLines(part.value)) {
      rows.push({
        left: null,
        right: line,
        type: "added",
        leftLineNo: null,
        rightLineNo: rightLineNo++,
      });
    }
    i++;
  }

  return rows;
}

export interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
}

export function summarize(rows: DiffRow[]): DiffStats {
  const stats: DiffStats = { added: 0, removed: 0, modified: 0, unchanged: 0 };
  for (const row of rows) {
    stats[row.type]++;
  }
  return stats;
}
