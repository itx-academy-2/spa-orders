const truncateWithEllipsis = (text: string, maxLength: number = 25) => {
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength).trimEnd();
  return `${trimmed}…`;
};

export default truncateWithEllipsis;
