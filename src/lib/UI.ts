import type {IVidWithCustom, userPreferencesI} from "@customTypes/types";
import type {Setter} from "solid-js";
import type {VideoJsPlayer} from "video.js";

// @unocss-include
const mobileHorizontalPadding = "px-3";
const CONTAINER = "max-w-[1000px] mx-auto";
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
export function getJsonFromDocCookie(key?: string): userPreferencesI | null {
  let keyToUse = key || "userPreferences";
  const cookieVal = document.cookie
    .split(";")
    ?.find((row) => row.replaceAll(" ", "").startsWith(keyToUse))
    ?.split("=")?.[1];
  if (!cookieVal) return null;
  console.log(cookieVal);
  let parsedObj: object | null = null;
  try {
    parsedObj = JSON.parse(cookieVal);
  } catch (error) {
    console.error(error);
  }
  return parsedObj;
}

export function setCookie(value: string, key?: string): void {
  const keyToUse = key || "userPreferences";

  const defaultCookiesOptions = {
    expires: new Date("01-18-2038").toUTCString(),
    path: "/",
    secure: true,
    sameSite: "strict",
  };
  // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies cookie prefxies

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
export function playerCustomHotKeys(
  e: KeyboardEvent,
  vjsPlayer: VideoJsPlayer
) {
  const currentTime = vjsPlayer.currentTime();
  switch (e.key) {
    case "ArrowLeft":
      vjsPlayer.currentTime(currentTime - 5);
      break;
    case "ArrowRight":
      vjsPlayer.currentTime(currentTime + 5);
      break;
    default:
      break;
  }
}

export function handleColorSchemeChange(
  e: MediaQueryListEvent,
  setPrefersDark: Setter<boolean>
) {
  const htmlElement = document.querySelector("html") as HTMLHtmlElement;
  const currCookie: userPreferencesI = getJsonFromDocCookie() || {};
  if (e.matches) {
    htmlElement.classList.add("dark");
    setPrefersDark(true);
    // write prefersDark True to cookie
    const currCookie: userPreferencesI | null = getJsonFromDocCookie();

    if (currCookie) {
      currCookie.prefersDark = true;
    }
  } else {
    htmlElement.classList.remove("dark");
    setPrefersDark(false);
    const currCookie: userPreferencesI | null = getJsonFromDocCookie();
    if (currCookie) {
      currCookie.prefersDark = false;
    }
    // write prefersDark False to cookie
  }
  // write out cookie on change;
  setCookie(JSON.stringify(currCookie).trim());
}
export function setUpThemeListener(setPrefersDark: Setter<boolean>) {
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const htmlElement = document.querySelector("html") as HTMLHtmlElement;

  if (
    darkModeMediaQuery.matches &&
    !htmlElement.classList.contains("light") &&
    !htmlElement.classList.contains("dark")
  ) {
    htmlElement.classList.add("dark");
    const currCookie: userPreferencesI = getJsonFromDocCookie() || {};
    currCookie.prefersDark = true;
    setCookie(JSON.stringify(currCookie).trim());
    setPrefersDark(true);
  }
  return darkModeMediaQuery;
}
export function updateCookiePrefByKey(key: keyof userPreferencesI, val: any) {
  const currCookie: userPreferencesI = getJsonFromDocCookie() || {};
  currCookie[key] = val;
  setCookie(JSON.stringify(currCookie).trim());
}
// Kobalte these components, add in i18n (including to player) see row, make the sw ts, and
// I need a select dropwdown for mp4 qualitites available for book:
// Download / Save (checkbox for each)
// Whole playlist / Whole Book / Current Video (radio)
// Single = pick your own.   So, select options depend on scope choice
// Whole book = smallest, or largest
// --Sizes (with a not about the lower the quality on size)
// Download (pressable)
// A callback for each to set the state in a signal which will write to urlFormEncoded to json stringify and hit the SW to be parsed.
// Prefer using saved video (with tooltip) (which writes to a cookie along with the dark/light toggle which should write to the same cookie)
// todo: make sure all selction of sources also checks that the source stirng is httpS and not http.
// todo:
// Indicator if is saved offline already (icones has a decent icon for this of cloud with checkmark or something)
