import React, { useEffect, useState } from "react";

function getSavedValue(key, initValue) {
  const savedValue = JSON.parse(localStorage.getItem(key));
  if (savedValue) return savedValue;

  if (initValue instanceof Function) return initValue();
  return initValue;
}

export default function useLocalStorage(key, initValue) {
  const [value, setValue] = useState(() => {
    console.log("useLocalStorage... ", key, initValue);
    return getSavedValue(key, initValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
}
