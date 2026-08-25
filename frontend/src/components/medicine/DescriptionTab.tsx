import styles from "./DescriptionTab.module.css";
import type { DescriptionBlock } from "./types";

type DescriptionTabProps = {
  paragraphs: DescriptionBlock[];
};

export function DescriptionTab({ paragraphs }: DescriptionTabProps) {
  return (
    <div className={styles.description}>
      {paragraphs.map((block) => (
        <p
          key={`${block.title ?? ""}${block.text.slice(0, 24)}`}
          className={styles.paragraph}
        >
          {block.title ? (
            <>
              <span className={styles.muted}>{block.title} </span>
              <span className={styles.text}>{block.text}</span>
            </>
          ) : (
            <span className={styles.muted}>{block.text}</span>
          )}
        </p>
      ))}
    </div>
  );
}
