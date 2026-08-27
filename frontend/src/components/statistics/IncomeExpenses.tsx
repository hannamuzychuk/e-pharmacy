import { useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import { EllipsisText } from "../EllipsisText/EllipsisText";
import styles from "./IncomeExpenses.module.css";
import type { IncomeExpense, TransactionType } from "./types";
import { formatSignedMoney } from "./format";

type IncomeExpensesProps = {
  items: IncomeExpense[];
};

const typeClass: Record<TransactionType, string> = {
  Income: styles.income,
  Expense: styles.expense,
  Error: styles.error,
};

const pickerTheme = createTheme({
  palette: {
    primary: {
      main: "#59b17a",
      dark: "#3f945f",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 60,
          backgroundColor: "#fff",
          fontSize: 14,
          "& fieldset": {
            borderColor: "rgba(29, 30, 33, 0.2)",
          },
        },
        input: {
          padding: "10px 14px",
        },
      },
    },
  },
});

function getItemsForDate(
  items: IncomeExpense[],
  date: Dayjs | null,
): IncomeExpense[] {
  if (!date || items.length === 0) {
    return [];
  }

  if (date.isSame(dayjs(), "day")) {
    return items;
  }

  if (date.isAfter(dayjs(), "day")) {
    return [];
  }

  const seed = date.date() + (date.month() + 1) * 31 + date.year();
  const count = Math.max(1, items.length - (seed % Math.min(3, items.length)));

  return [...items]
    .map((item, index) => ({
      item,
      rank: (index * 17 + seed) % 97,
    }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, count)
    .map(({ item }) => item);
}

export function IncomeExpenses({ items }: IncomeExpensesProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const isToday = selectedDate?.isSame(dayjs(), "day") ?? false;
  const dayLabel = !selectedDate
    ? "Select a day"
    : isToday
      ? "Today"
      : selectedDate.format("DD.MM.YYYY");

  const visibleItems = useMemo(
    () => getItemsForDate(items, selectedDate),
    [items, selectedDate],
  );

  return (
    <section className={styles.card} aria-labelledby="income-expenses-title">
      <div className={styles.head}>
        <h2 id="income-expenses-title" className={styles.title}>
          Income/Expenses
        </h2>
      </div>

      <div className={styles.body}>
        <div className={styles.dateRow}>
          <p className={styles.today}>{dayLabel}</p>
          <ThemeProvider theme={pickerTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={setSelectedDate}
                format="DD.MM.YYYY"
                maxDate={dayjs()}
                disableFuture
                slotProps={{
                  textField: {
                    size: "small",
                    className: styles.dateField,
                  },
                }}
              />
            </LocalizationProvider>
          </ThemeProvider>
        </div>

        {visibleItems.length === 0 ? (
          <p className={styles.empty}>No transactions for this day.</p>
        ) : (
          <ul className={styles.list}>
            {visibleItems.map((item) => (
              <li key={`${item.id}-${dayLabel}`} className={styles.row}>
                <div className={styles.main}>
                  <span className={`${styles.tag} ${typeClass[item.type]}`}>
                    {item.type}
                  </span>
                  <p className={styles.description}>
                    <EllipsisText text={item.description} length={36} />
                  </p>
                </div>
                <span className={`${styles.amount} ${typeClass[item.type]}`}>
                  {formatSignedMoney(item.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
