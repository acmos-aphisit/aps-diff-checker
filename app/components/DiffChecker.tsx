"use client";

import { useMemo, useState } from "react";
import { buildSideBySideDiff, summarize } from "@/app/lib/diff";
import styles from "./DiffChecker.module.css";

function lineCount(text: string): number {
  if (text === "") return 0;
  return text.split("\n").length;
}

export default function DiffChecker() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");

  const rows = useMemo(() => buildSideBySideDiff(original, changed), [original, changed]);
  const stats = useMemo(() => summarize(rows), [rows]);

  const hasInput = original.length > 0 || changed.length > 0;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Diff</h1>
        <p className={styles.subtitle}>Paste two versions of your code to compare them line by line.</p>
      </header>

      <div className={styles.inputGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>Original Text</span>
            <span className={styles.panelMeta}>{lineCount(original)} lines</span>
          </div>
          <textarea
            className={styles.textarea}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste the original code here…"
            spellCheck={false}
            aria-label="Original text"
          />
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>Changed Text</span>
            <span className={styles.panelMeta}>{lineCount(changed)} lines</span>
          </div>
          <textarea
            className={styles.textarea}
            value={changed}
            onChange={(e) => setChanged(e.target.value)}
            placeholder="Paste the changed code here…"
            spellCheck={false}
            aria-label="Changed text"
          />
        </div>
      </div>

      <div className={styles.statsBar} aria-live="polite">
        <span className={styles.statItem}>
          <span className={`${styles.dot} ${styles.dotAdded}`} />
          {stats.added} added
        </span>
        <span className={styles.statItem}>
          <span className={`${styles.dot} ${styles.dotRemoved}`} />
          {stats.removed} removed
        </span>
        <span className={styles.statItem}>
          <span className={`${styles.dot} ${styles.dotModified}`} />
          {stats.modified} modified
        </span>
      </div>

      <div className={styles.diffPanel}>
        {!hasInput ? (
          <p className={styles.emptyState}>The diff will appear here once you paste some code above.</p>
        ) : (
          <div className={styles.diffGrid} role="table" aria-label="Code diff">
            <div className={styles.paneHeaderRow}>
              <div className={styles.paneHeader} aria-hidden="true" />
              <div className={styles.paneHeader}>Original</div>
              <div className={styles.paneHeader} aria-hidden="true" />
              <div className={styles.paneHeader}>Changed</div>
            </div>

            {rows.map((row, idx) => {
              const rowClass =
                row.type === "modified"
                  ? ""
                  : row.type === "added"
                    ? styles.rowAdded
                    : row.type === "removed"
                      ? styles.rowRemoved
                      : styles.rowUnchanged;

              const leftClass =
                row.type === "modified"
                  ? styles.rowModifiedLeft
                  : `${rowClass} ${row.left !== null ? styles.side : ""}`;
              const rightClass =
                row.type === "modified"
                  ? styles.rowModifiedRight
                  : `${rowClass} ${row.right !== null ? styles.side : ""}`;

              return (
                <div className={styles.paneHeaderRow} key={idx}>
                  <div className={`${styles.lineNo} ${leftClass}`}>{row.leftLineNo ?? ""}</div>
                  <div
                    className={`${styles.codeLine} ${leftClass} ${row.left === null ? styles.emptyLine : ""}`}
                  >
                    {row.left ?? ""}
                  </div>
                  <div className={`${styles.lineNo} ${rightClass}`}>{row.rightLineNo ?? ""}</div>
                  <div
                    className={`${styles.codeLine} ${rightClass} ${row.right === null ? styles.emptyLine : ""}`}
                  >
                    {row.right ?? ""}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
