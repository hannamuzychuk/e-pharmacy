type EllipsisTextProps = {
  text: string;
  length?: number;
  className?: string;
  tail?: string;
};

export function EllipsisText({
  text,
  length = 24,
  className,
  tail = "...",
}: EllipsisTextProps) {
  if (length < 0 || text.length <= length) {
    return <span className={className}>{text}</span>;
  }

  const visibleLength = Math.max(0, length - tail.length);
  const displayText = text.slice(0, visibleLength);

  return (
    <span className={className} title={text}>
      {displayText}
      <span className="more">{tail}</span>
    </span>
  );
}
