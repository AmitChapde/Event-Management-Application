import styles from "./Calendar.module.css";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
} from "date-fns";

const Calendar = ({ selectedDate, setSelectedDate, currentDate, setCurrentDate, setOpen }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const daysArray = eachDayOfInterval({ start: startDate, end: endDate });
  const monthLabel = format(currentDate, "MMMM yyyy");
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setOpen(false);
  };

  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToPrevMonth = () => setCurrentDate(addMonths(currentDate, -1));

  return (
    <div className={styles.calendarPopup}>
      <div className={styles.calendarHeader}>
        <button className={styles.navButton} onClick={goToPrevMonth}>&lt;</button>
        <span className={styles.monthLabel}>{monthLabel}</span>
        <button className={styles.navButton} onClick={goToNextMonth}>&gt;</button>
      </div>

      <div className={styles.grid}>
        {weekdays.map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}

        {daysArray.map((day) => (
          <div
            key={day.getTime()}
            className={`${styles.day} 
              ${!isSameMonth(day, monthStart) ? styles.disabled : ""} 
              ${isSameDay(day, selectedDate) ? styles.selected : ""}`}
            onClick={() => handleDayClick(day)}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
