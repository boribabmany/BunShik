// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// jsdom(테스트 환경)에 TextEncoder/TextDecoder가 전역으로 없어서
// react-router-dom v7 로딩 시 발생하는 ReferenceError를 막기 위한 polyfill
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

// jsdom(테스트 환경)에는 document.fonts(FontFaceSet)가 구현되어 있지 않아
// 폰트 로딩 여부를 확인하는 컴포넌트(CartItem 등)가 깨지는 것을 막기 위한 최소 shim
if (!document.fonts) {
  Object.defineProperty(document, "fonts", {
    value: { ready: Promise.resolve() },
    configurable: true,
  });
}
