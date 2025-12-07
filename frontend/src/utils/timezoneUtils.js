import dayjs from "./setupDayjs";

function toUTC(dateObj, timeString, timezone) {
  if (!dateObj || !timeString || !timezone) return null;

  const [h, m] = timeString.split(":").map(Number);
  const dateString = dayjs(dateObj).format("YYYY-MM-DD");

  const datetimeInTZ = dayjs.tz(
    `${dateString} ${h}:${m}:00`,
    "YYYY-MM-DD HH:mm:ss",
    timezone
  );

  return datetimeInTZ.utc().toISOString();
}

function isEndBeforeStart(startUTC, endUTC) {
  if (!startUTC || !endUTC) return false;
  return dayjs(endUTC).isBefore(dayjs(startUTC));
}

function isBeforeToday(dateObj) {
  if (!dateObj) return false;
  const today = dayjs().startOf("day");
  const dateToCheck = dayjs(dateObj).startOf("day");
  return dateToCheck.isBefore(today);
}

function formatEventTime(timeUTC, tz, format = "YYYY-MM-DD HH:mm") {
  return dayjs.utc(timeUTC).tz(tz).format(format);
}

export { toUTC, isEndBeforeStart, isBeforeToday, formatEventTime };
