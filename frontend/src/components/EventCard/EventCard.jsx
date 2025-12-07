import styles from "./EventCard.module.css";
import dayjs from "../../utils/setupDayjs";
import { User, Calendar, Clock, ScrollText, Pen } from "lucide-react";

function formatInTz(utcStringOrDate, tz) {
  if (!utcStringOrDate) return { date: "—", time: "—" };
  const d = dayjs(utcStringOrDate).tz(tz);
  return {
    date: d.format("MMM DD, YYYY"),
    time: d.format("hh:mm A"),
  };
}

function getProfileLabels(assignedProfiles) {
  if (!assignedProfiles || assignedProfiles.length === 0) return ["—"];
  return assignedProfiles.map((p) => {
    if (!p) return "—";
    if (typeof p === "string") return p;
    return p.name || p.displayName || p.username || p.handle || p._id || "—";
  });
}

function EventCard({ event, timezone, onEdit, onViewLogs }) {
  const start = formatInTz(event?.startTimeUTC, timezone);
  const end = formatInTz(event?.endTimeUTC, timezone);

  const created = event?.createdAt
    ? dayjs(event.createdAt).tz(timezone).format("MMM DD, YYYY [at] hh:mm A")
    : "—";
  const updated = event?.updatedAt
    ? dayjs(event.updatedAt).tz(timezone).format("MMM DD, YYYY [at] hh:mm A")
    : "—";

  const profiles = getProfileLabels(event?.assignedProfiles);

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <User className={styles.icon} />
        <div className={styles.profileNames} title={profiles.join(", ")}>
          {profiles.join(", ")}
        </div>
      </div>

      <div className={styles.titleRow}>
        <div className={styles.titleText}>
          {event?.title || "Untitled Event"}
        </div>
      </div>

      <div className={styles.whenBlock}>
        <div className={styles.whenRow}>
          <div className={styles.whenLabel}>Start:</div>
          <div className={styles.whenValue}>
            <div className={styles.whenLine}>
              <Calendar className={styles.smallIcon} />
              <span>{start.date}</span>
            </div>
            <div className={styles.whenLine}>
              <Clock className={styles.smallIcon} />
              <span>{start.time}</span>
            </div>
          </div>
        </div>

        <div className={styles.whenRow}>
          <div className={styles.whenLabel}>End:</div>
          <div className={styles.whenValue}>
            <div className={styles.whenLine}>
              <Calendar className={styles.smallIcon} />
              <span>{end.date}</span>
            </div>
            <div className={styles.whenLine}>
              <Clock className={styles.smallIcon} />
              <span>{end.time}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.meta}>
        <div className={styles.metaItem}>Created: {created}</div>
        <div className={styles.metaItem}>Updated: {updated}</div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={onEdit}
        >
          <span className={styles.btnContainer}>
            <Pen size={15} />
            Edit
          </span>
        </button>
        <button
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={() => onViewLogs?.(event)}
        >
          <span className={styles.btnContainer}>
            <ScrollText size={15} />
            View Logs
          </span>
        </button>
      </div>
    </div>
  );
}

export default EventCard;
