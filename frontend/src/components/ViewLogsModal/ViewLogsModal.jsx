import React, { useEffect, useMemo, useState } from "react";
import styles from "./ViewLogsModal.module.css";
import { getEventLogs } from "../../api/eventApi";
import dayjs from "../../utils/setupDayjs";
import ErrorSnackbar from "../common/ErrorSnackbar/ErrorSnackbar";

function ViewLogsModal({ event, eventId, onClose }) {
  const resolvedEventId = event?._id || event?.id || eventId || null;
  const timezone = event?.initialTimezone || dayjs.tz.guess();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!resolvedEventId) return;

    let alive = true;
    (async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await getEventLogs(resolvedEventId);
        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];
        const sorted = data
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updateTimestampUTC).getTime() -
              new Date(a.updateTimestampUTC).getTime()
          );
        if (alive) setLogs(sorted);
      } catch (err) {
        console.error("Failed to load logs", err);
        if (alive) setErrorMsg("Failed to load update history.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [resolvedEventId]);

  const formatWhen = (ts) => {
    if (!ts) return "";
    return dayjs.utc(ts).tz(timezone).format("MMM DD, YYYY [at] hh:mm A");
  };

  const describeChange = (change) => {
    const field = change?.fieldName;
    if (field === "title") {
      const nv = (change?.newValue || "").toString().trim();
      return nv ? `Title changed to: ${nv}` : "Title updated";
    }
    if (field === "assignedProfiles") {
      const newIds = Array.isArray(change?.newValue) ? change.newValue : [];
      return newIds.length
        ? `Profiles updated (${newIds.length})`
        : "Profiles updated";
    }
    if (field === "startTimeUTC") return "Start date/time updated";
    if (field === "endTimeUTC") return "End date/time updated";
    if (field === "initialTimezone")
      return `Timezone changed to: ${change?.newValue || ""}`;
    return `${field || "Field"} updated`;
  };

  const items = useMemo(() => {
    const out = [];
    for (const log of logs) {
      const who = log?.updatedBy?.name;
      const when = log?.updateTimestampUTC;
      if (Array.isArray(log?.changes) && log.changes.length) {
        for (const ch of log.changes) {
          out.push({
            id: `${log._id}-${ch._id || ch.fieldName}`,
            when,
            text: `${who} • ${describeChange(ch)}`,
          });
        }
      } else {
        out.push({
          id: log._id,
          when,
          text: `${who} • Event updated`,
        });
      }
    }
    return out;
  }, [logs]);

  if (!resolvedEventId) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h4 className={styles.title}>Event Update History</h4>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>Loading history...</div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>No updates yet</div>
          ) : (
            <div className={styles.list}>
              {items.map((it) => (
                <div key={it.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.dot} />
                    <span className={styles.time}>{formatWhen(it.when)}</span>
                  </div>
                  <div className={styles.cardBody}>{it.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {errorMsg && (
          <ErrorSnackbar message={errorMsg} onClose={() => setErrorMsg("")} />
        )}
      </div>
    </div>
  );
}

export default ViewLogsModal;
