import { useState } from "react";

export default function useTimezone(defaultTZ = "UTC") {
  const [timezone, setTimezone] = useState(defaultTZ);

  return { timezone, setTimezone };
}
