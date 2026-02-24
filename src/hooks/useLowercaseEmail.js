import { useState, useCallback } from "react";

const useLowercaseEmail = (initialValue = "") => {
  const [email, setEmailRaw] = useState(initialValue.toLowerCase());

  const setEmail = useCallback((valueOrEvent) => {
    const raw =
      typeof valueOrEvent === "object" && valueOrEvent?.target !== undefined
        ? valueOrEvent.target.value
        : valueOrEvent;
    setEmailRaw(String(raw).toLowerCase());
  }, []);

  const resetEmail = useCallback(() => setEmailRaw(""), []);

  return [email, setEmail, resetEmail];
};

export default useLowercaseEmail;
