export function fitFontSizeByDOM(
  text,
  maxWidth,
  {
    max = 46,
    min = 36,
    fontWeight = 500,
    fontFamily = "Pretendard, sans-serif",
  } = {},
) {
  const span = document.createElement("span");
  span.style.position = "absolute";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "nowrap";
  span.style.fontWeight = fontWeight;
  span.style.fontFamily = fontFamily;
  span.textContent = text;
  document.body.appendChild(span);

  let result = min;
  for (let size = max; size >= min; size -= 1) {
    span.style.fontSize = `${size}px`;
    const width = span.getBoundingClientRect().width;
    if (width <= maxWidth) {
      result = size;
      break;
    }
  }

  document.body.removeChild(span);
  return result;
}
