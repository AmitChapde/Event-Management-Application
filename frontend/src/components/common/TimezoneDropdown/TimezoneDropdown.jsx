import React, { useState } from "react";
import styles from "./TimezoneDropdown.module.css";
import { TIMEZONES } from "../../../constants/timezones";

function TimezoneDropdown({
  value,
  onChange,
  label,
  placeholder = "Search timezone...",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = TIMEZONES.filter((tz) =>
    tz.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel =
    TIMEZONES.find((tz) => tz.value === value)?.label || placeholder;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.selectBox} onClick={() => setOpen(!open)}>
        {selectedLabel}
      </div>

      {open && (
        <div className={styles.dropdown}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filtered.map((tz) => (
            <div
              key={tz.value}
              className={`${styles.option} ${
                tz.value === value ? styles.selectedOption : ""
              }`}
              onClick={() => {
                onChange(tz.value);
                setOpen(false);
                setSearch("");
              }}
            >
              {tz.label}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className={styles.noResults}>No results</div>
          )}
        </div>
      )}
    </div>
  );
}

export default TimezoneDropdown;
