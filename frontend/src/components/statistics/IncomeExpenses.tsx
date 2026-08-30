import { useEffect, useMemo, useState } from "react";
import GlobalStyles from "@mui/material/GlobalStyles";
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
    MuiPickerDay: {
      styleOverrides: {
        root: {
          margin: "0 2px",
          fontSize: 13,
          fontWeight: 500,
          borderRadius: "50%",
          transition: "background-color 0.15s ease, color 0.15s ease",
          "&:hover": {
            backgroundColor: "rgba(89, 177, 122, 0.14)",
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
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          margin: 0,
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 12,
          paddingRight: 8,
          minHeight: 40,
          background:
            "linear-gradient(180deg, #e7f1ed 0%, rgba(231, 241, 237, 0.35) 100%)",
          borderBottom: "1px solid rgba(89, 177, 122, 0.12)",
        },
        label: {
          fontSize: 14,
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
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: {
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(29, 30, 33, 0.4)",
        },
      },
    },
    MuiYearCalendar: {
      styleOverrides: {
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

const calendarNoScrollStyles = {
  ".MuiPickerPopper-root": {
    maxWidth: "100%",
  },
  ".MuiPickerPopper-paper, .MuiDialog-paper": {
    boxSizing: "border-box",
    width: "min(300px, calc(100vw - 24px))",
    maxWidth: "calc(100vw - 24px)",
    overflow: "hidden",
    borderRadius: "20px",
    border: "1px solid rgba(89, 177, 122, 0.2)",
    boxShadow:
      "0 18px 40px rgba(29, 30, 33, 0.12), 0 4px 12px rgba(89, 177, 122, 0.12)",
  },
  ".MuiPickerPopper-paper .MuiDateCalendar-root, .MuiDialog-paper .MuiDateCalendar-root":
    {
      width: "100% !important",
      maxWidth: "100%",
      height: "auto !important",
      maxHeight: "none !important",
      overflow: "visible !important",
    },
  ".MuiPickerPopper-paper .MuiYearCalendar-root, .MuiDialog-paper .MuiYearCalendar-root, .MuiPickerPopper-paper .MuiMonthCalendar-root, .MuiDialog-paper .MuiMonthCalendar-root":
    {
      width: "100% !important",
      maxWidth: "100%",
      height: "auto !important",
      maxHeight: "none !important",
      overflow: "visible !important",
      overflowY: "visible !important",
    },
  ".MuiPickerPopper-paper .MuiDayCalendar-slideTransition, .MuiPickerPopper-paper .MuiDayCalendar-monthContainer, .MuiPickerPopper-paper .MuiPickersSlideTransition-root, .MuiDialog-paper .MuiDayCalendar-slideTransition, .MuiDialog-paper .MuiDayCalendar-monthContainer, .MuiDialog-paper .MuiPickersSlideTransition-root":
    {
      overflow: "visible !important",
    },
  ".MuiPickerPopper-paper .MuiPickersLayout-root, .MuiPickerPopper-paper .MuiPickersLayout-contentWrapper, .MuiDialog-paper .MuiPickersLayout-root, .MuiDialog-paper .MuiPickersLayout-contentWrapper":
    {
      overflow: "visible !important",
      maxWidth: "100%",
    },
};

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
  const [isPickerOpen, setIsPickerOpen] = useState(false);
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

  useEffect(() => {
    if (!isPickerOpen) {
      return;
    }

    const closePicker = () => setIsPickerOpen(false);
    window.addEventListener("scroll", closePicker, true);
    return () => window.removeEventListener("scroll", closePicker, true);
  }, [isPickerOpen]);

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
            <GlobalStyles styles={calendarNoScrollStyles} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Pick a date"
                value={selectedDate}
                onChange={setSelectedDate}
                open={isPickerOpen}
                onOpen={() => setIsPickerOpen(true)}
                onClose={() => setIsPickerOpen(false)}
                format="DD.MM.YYYY"
                maxDate={dayjs()}
                minDate={dayjs().subtract(10, "year")}
                disableFuture
                openTo="day"
                views={["year", "month", "day"]}
                yearsPerRow={3}
                monthsPerRow={3}
                desktopModeMediaQuery="@media (min-width: 0px)"
                slotProps={{
                  textField: {
                    size: "small",
                    className: styles.dateField,
                  },
                  openPickerButton: {
                    className: styles.calendarBtn,
                  },
                  popper: {
                    disablePortal: true,
                    placement: "bottom-end",
                    className: styles.calendarPopper,
                    modifiers: [
                      {
                        name: "offset",
                        options: { offset: [0, 8] },
                      },
                      {
                        name: "flip",
                        options: {
                          padding: 8,
                          fallbackPlacements: ["top-end", "bottom-start"],
                        },
                      },
                      {
                        name: "preventOverflow",
                        options: {
                          altAxis: true,
                          padding: 8,
                          boundary: "clippingParents",
                        },
                      },
                    ],
                  },
                  desktopPaper: {
                    className: styles.calendarPaper,
                    elevation: 0,
                    sx: {
                      overflow: "hidden",
                    },
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
