export const formatPriceInput = (value) => {
  if (value === "" || value === null || value === undefined) return "";

  const digits = String(value).replace(/\D/g, "");
  return digits === "" ? "" : Number(digits).toLocaleString("ko-KR");
};

export const createPriceChangeHandler = (onChange) => (event) => {
  onChange({
    target: {
      name: event.target.name,
      value: event.target.value.replace(/\D/g, ""),
    },
  });
};
