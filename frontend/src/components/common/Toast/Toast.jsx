import React, { useEffect, useState } from "react";
import styles from "./Toast.module.css";

const Toast = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={styles.toast}>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={() => { setVisible(false); onClose && onClose(); }}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
