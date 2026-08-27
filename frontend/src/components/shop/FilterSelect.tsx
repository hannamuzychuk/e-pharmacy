import { useEffect, useId, useRef, useState } from "react";
import styles from "./FilterSelect.module.css";

type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  hideLabel?: boolean;
  placeholder?: string;
};

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  hideLabel = false,
  placeholder,
}: FilterSelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const isPlaceholder = Boolean(placeholder) && (!selectedOption || value === "all");
  const selectedLabel = isPlaceholder
    ? placeholder
    : (selectedOption?.label ?? value);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.field} ref={rootRef}>
      {!hideLabel ? (
        <span className={styles.label} id={`${listboxId}-label`}>
          {label}
        </span>
      ) : (
        <span className={styles.srOnly} id={`${listboxId}-label`}>
          {label}
        </span>
      )}

      <div className={styles.selectWrap}>
        <button
          className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""} ${
            isPlaceholder ? styles.triggerPlaceholder : ""
          }`}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`${listboxId}-label`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedLabel}
        </button>

        <svg className={styles.selectIcon} width="8" height="14" aria-hidden="true">
          <use href="/icons.svg#icon-chevron-right" />
        </svg>

        {isOpen ? (
          <ul
            className={styles.list}
            id={listboxId}
            role="listbox"
            aria-labelledby={`${listboxId}-label`}
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value} role="none">
                  <button
                    className={`${styles.option} ${
                      isSelected ? styles.optionSelected : ""
                    }`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
