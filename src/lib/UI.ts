import type {cssVariables} from "@customTypes/types";

// @unocss-include
const mobileHorizontalPadding = "px-3";
const CONTAINER = "max-w-[1200px] mx-auto";
export {mobileHorizontalPadding, CONTAINER};

export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  wait: number
): ((...args: T) => void) => {
  let timeoutId: number | null = null;
  return (...args: T) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
/**
 * Get a value from local storage by key, or return undefined if the key is not found
 */
export function getFromLocalStorage<T>(key: string): T | undefined {
  const value = localStorage.getItem(key);
  if (value === null) {
    return undefined;
  }
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(
      `Error parsing JSON from local storage key "${key}": ${error}`
    );
    return undefined;
  }
}

/**
 * Set a value in local storage by key
 */
export function setToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting JSON to local storage key "${key}": ${error}`);
  }
}

export async function searchCache(
  url: string,
  cacheName?: string
): Promise<Response | undefined> {
  if (!("caches" in window)) {
    return undefined;
  }
  // todo: change to mathc, or just open the given cacheName
  const cache = cacheName
    ? await caches.open(cacheName)
    : await caches.open("my-cache");
  const matchingResponse = await cache.match(url);
  if (matchingResponse) {
    return matchingResponse;
  } else {
    return undefined;
  }
}
export function setCookie(key: string, value: string): void {
  const defaultCookiesOptions = {
    expires: new Date("01-18-2038").toUTCString(),
    path: "/",
    secure: true,
    sameSite: "strict",
  };
  // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies cookie prefxies
  const keyToUse = `${key}`;

  const cookieString =
    `${keyToUse}=${value};` +
    `expires=${defaultCookiesOptions.expires};` +
    defaultCookiesOptions.path +
    +(defaultCookiesOptions.secure ? `secure;` : "") +
    (defaultCookiesOptions.sameSite
      ? `sameSite=${defaultCookiesOptions.sameSite};`
      : "");

  document.cookie = cookieString;
}
// Kobalte these components, add in i18n (including to player) see row, make the sw ts, and
// I need a select dropwdown for mp4 qualitites available for book:
// Download / Save (checkbox for each)
// Whole Book / Current Video (radio)
// Single = pick your own.   So, select options depend on scope choice
// Whole book = smallest, or largest
// --Sizes (with a not about the lower the quality on size)
// Download (pressable)
// A callback for each to set the state in a signal which will write to urlFormEncoded to json stringify and hit the SW to be parsed.
// Prefer using saved video (with tooltip) (which writes to a cookie along with the dark/light toggle which should write to the same cookie)

// Indicator if is saved offline already (icones has a decent icon for this of cloud with checkmark or something)

// function cssVarValue(property: cssVariables) {
//   return getComputedStyle(document.documentElement).getPropertyValue(property);
// }
// function hslToArr(str: string) {
//   return str.split(",");
// }
// function getHslPart(hslArr: string[], piece: "H" | "S" | "L") {
//   if (piece === "H") {
//     return Number(hslArr[0]);
//   } else if (piece === "S") {
//     return Number(hslArr[1]?.replace("%", ""));
//   } else if (piece === "L") {
//     return Number(hslArr[2]?.replace("%", ""));
//   }
// }

// type hslOptions = {
//   h?: number;
//   s?: number;
//   l?: number;
// };
// export function adjustClr(property: cssVariables, hslOpts: hslOptions) {
//   debugger;
//   const varHslArr = hslToArr(cssVarValue(property));
//   if (hslOpts.h) {
//     varHslArr[0] = `${varHslArr[0] + hslOpts.h}`.trim();
//   }
//   if (hslOpts.s) {
//     const newVal = normalizeHslNum(varHslArr[1]) + hslOpts.s;
//     if (newVal > 100) {
//       varHslArr[1] = "100%";
//     } else if (newVal < 0) {
//       varHslArr[1] = "0%";
//     } else {
//       varHslArr[1] = `${newVal}%`;
//     }
//   }
//   if (hslOpts.l) {
//     const newVal = normalizeHslNum(varHslArr[2]) + hslOpts.l;
//     if (newVal > 100) {
//       varHslArr[2] = "100%";
//     } else if (newVal < 0) {
//       varHslArr[2] = "0%";
//     } else {
//       varHslArr[2] = `${newVal}%`;
//     }
//   }
//   console.log(`hsl(${varHslArr.join(",").trim()})`);
//   return `hsl(${varHslArr.join(",").replaceAll(" ", "")})`;
// }
// function normalizeHslNum(str: string) {
//   return Number(str.replaceAll(" ", "").replaceAll("%", "").trim());
// }
