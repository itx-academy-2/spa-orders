export const removeKeyFromObject = <T extends Record<string, any>>(
  obj: T,
  keyToRemove: string
): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key !== keyToRemove)
  ) as T;
};
