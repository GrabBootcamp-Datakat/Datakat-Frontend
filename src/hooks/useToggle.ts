import { useState } from "react";

export function useToggle(initial = false) {
  const [open, setOpen] = useState(initial);
  const toggle = () => setOpen((prev) => !prev);
  return { open, toggle };
}
