import { useEffect, useState } from "react";

/**
 * Provides a boolean state and a delay when setting that state to true.
 * @param dependencies Like useEffect, the delay will only change when these dependencies change.
 * @param delayInMs Delay in milliseconds.
 * @param defaultValue Default value of the boolean.
 * @returns Like useState, an array with the value and a setter for that value.
 *
 * Note that the setter bypasses the delay.
 */
export default function useDelay(
  dependencies: any[] = [],
  defaultValue: boolean = false,
  delayInMs: number = 250,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    let timer: number;

    if (value) {
      timer = setTimeout(() => {
        setValue(true);
      }, delayInMs);
    } else {
      setValue(false);
    }

    return () => clearTimeout(timer);
  }, dependencies);

  return [value, setValue];
}
