import { useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";
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
      light: "#e7f1ed",
    },
    text: {
      primary: "#1d1e21",
      secondary: "rgba(29, 30, 33, 0.6)",
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
          backgroundColor: "#f7f8fa",
          fontSize: 14,
          fontWeight: 500,
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
          "& fieldset": {
            borderColor: "rgba(89, 177, 122, 0.35)",
            borderWidth: 1.5,
          },
          "&:hover": {
            backgroundColor: "#fff",
            "& fieldset": {
              borderColor: "#59b17a",
            },
          },
          "&.Mui-focused": {
            backgroundColor: "#fff",
            boxShadow: "0 0 0 4px rgba(89, 177, 122, 0.15)",
            "& fieldset": {
              borderColor: "#59b17a",
              borderWidth: 1.5,
            },
          },
        },
        input: {
          padding: "10px 4px 10px 14px",
          letterSpacing: "0.02em",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 13,
          color: "rgba(29, 30, 33, 0.45)",
          "&.Mui-focused": {
            color: "#59b17a",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#59b17a",
          "&:hover": {
            backgroundColor: "rgba(89, 177, 122, 0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          "&.MuiPickerPopper-paper": {
            marginTop: 8,
            overflow: "hidden",
            border: "1px solid rgba(89, 177, 122, 0.2)",
            borderRadius: 20,
            boxShadow:
              "0 18px 40px rgba(29, 30, 33, 0.12), 0 4px 12px rgba(89, 177, 122, 0.12)",
          },
        },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        root: {
          margin: "2px",
          fontSize: 13,
          fontWeight: 500,
          borderRadius: "50%",
          transition:
            "background-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
          "&:hover": {
            backgroundColor: "rgba(89, 177, 122, 0.14)",
            transform: "scale(1.06)",
          },
          "&.Mui-selected": {
            backgroundColor: "#59b17a !important",
            color: "#fff !important",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(89, 177, 122, 0.4)",
            "&:hover": {
              backgroundColor: "#3f945f !important",
            },
          },
          "&.MuiPickerDay-today": {
            border: "1.5px solid #59b17a",
            backgroundColor: "transparent",
            "&:not(.Mui-selected)": {
              color: "#3f945f",
              fontWeight: 600,
            },
          },
        },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: {
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(29, 30, 33, 0.4)",
        },
        header: {
          paddingTop: 4,
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          marginTop: 4,
          marginBottom: 4,
          paddingLeft: 16,
          paddingRight: 12,
          background:
            "linear-gradient(180deg, #e7f1ed 0%, rgba(231, 241, 237, 0.35) 100%)",
          borderBottom: "1px solid rgba(89, 177, 122, 0.12)",
        },
        label: {
          fontSize: 15,
          fontWeight: 600,
          color: "#1d1e21",
        },
        switchViewButton: {
          color: "#59b17a",
        },
      },
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        button: {
          color: "#59b17a",
          "&:hover": {
            backgroundColor: "rgba(89, 177, 122, 0.12)",
          },
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          width: 320,
          maxHeight: "none",
          backgroundColor: "#fff",
        },
      },
    },
    MuiYearCalendar: {
      styleOverrides: {
        root: {
          width: 320,
        },
        button: {
          borderRadius: 12,
          fontWeight: 500,
          "&.Mui-selected": {
            backgroundColor: "#59b17a !important",
            color: "#fff",
          },
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
                label="Pick a date"
                value={selectedDate}
                onChange={setSelectedDate}
                format="DD.MM.YYYY"
                maxDate={dayjs()}
                disableFuture
                views={["year", "month", "day"]}
                slotProps={{
                  textField: {
                    size: "small",
                    className: styles.dateField,
                  },
                  openPickerButton: {
                    className: styles.calendarBtn,
                  },
                  desktopPaper: {
                    className: styles.calendarPaper,
                    elevation: 0,
                  },
                  mobilePaper: {
                    className: styles.calendarPaper,
                    elevation: 0,
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
