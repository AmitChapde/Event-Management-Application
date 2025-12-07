import { useEffect, useState } from "react";
import styles from "./ErrorSnackbar.module.css";

function ErrorSnackbar({ message, onClose }) {
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
    <div className={styles.snackbar}>
      <span>{message}</span>
      <button
        className={styles.closeButton}
        onClick={() => {
          setVisible(false);
          onClose && onClose();
        }}
      >
        ×
      </button>
    </div>
  );
}


export default ErrorSnackbar;