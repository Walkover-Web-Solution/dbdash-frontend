import {useSelector} from "react-redux";

export default function isEqual(oldValue, newValue) {
  if (oldValue === newValue) return true;

  if (
    oldValue === null ||
    oldValue === undefined ||
    newValue === null ||
    newValue === undefined
  ) {
    return false;
  }

  if (typeof oldValue !== typeof newValue) return false;

  if (Array.isArray(oldValue)) {
    if (!Array.isArray(newValue)) return false;
    if (oldValue.length !== newValue.length)  return false;

    for (let i = 0; i < oldValue.length; i++) {
      if (!isEqual(oldValue[i], newValue[i])) return false;
    }

    return true;
  }

  if (typeof oldValue === "object") {
    const keys1 = Object.keys(oldValue);
    const keys2 = Object.keys(newValue);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!isEqual(oldValue[key], newValue[key])) return false;
    }

    return true;
  }

  return oldValue === newValue;
}

 const customEqual = (oldVal, newVal) => isEqual(oldVal, newVal);

export const customUseSelector = (stateChangesKaFuntion) => {
  const data=useSelector(stateChangesKaFuntion, customEqual);
  return data;
}

