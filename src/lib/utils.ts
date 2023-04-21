import type {userPreferencesI} from "@customTypes/types";
import {baseLocale, supportedLanguages} from "@i18n/index";
import type {AstroGlobal} from "astro";
export function formatDuration(milliseconds: number) {
  // Convert milliseconds to seconds
  const seconds = Math.floor(milliseconds / 1000);

  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Format the time string and trim leading zeros
  let timeString = "";

  if (hours > 0) {
    timeString = `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  if (hours == 0 || minutes > 0) {
    timeString = `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    timeString = `0:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return timeString;
}

export function convertToValidFilename(string: string) {
  return string.replace(/[\/|\\:*?"<>]/g, " ").replace(" ", "_");
}
export function normalizeBookName(bookname: string | undefined) {
  if (!bookname) return "";
  const parts = bookname.split(/(\d+)/).filter((r) => !!r); // Split on any digits
  if (parts.length > 1) {
    const secondPart = upperFirstLowerRest(parts[1]);
    return `${parts[0]} ${secondPart}`;
  } else return upperFirstLowerRest(bookname);
}
export function upperFirstLowerRest(bookName: string) {
  return `${bookName.slice(0, 1).toUpperCase()}${bookName
    .slice(1)
    .toLowerCase()}`;
}
export function formatPlayListName(playlist: string | undefined) {
  if (!playlist) return "";
  const parts = playlist.split("-");
  const cased = parts.map((part) => upperFirstLowerRest(part));
  return cased.join(" ");
}
export function convertTimeToSeconds(timeStr: string): number {
  const [mins, secs] = timeStr.split(":").map(Number);
  const milliseconds = Number(timeStr.split(".")[1]);
  return mins * 60 + secs + milliseconds / 1000;
}
export function bytesToMb(bytes: number | undefined) {
  if (!bytes) return "";
  const val = Math.round(bytes / 1000 / 1000);
  return String(val);
}

interface ObjectGroup {
  [key: string]: object[];
}

export function groupObjectsByKey<
  T extends {[key: string]: any},
  K extends keyof T
>(objects: T[], key: K): Record<T[K], T[]> {
  const groups = {} as Record<T[K], T[]>;

  // Iterate over each object in the array
  objects.forEach((object) => {
    // Get the value of the specified key
    const value = object[key];

    // If there is no group for the value, create one
    if (!groups[value]) {
      groups[value] = [];
    }

    // Add the object to the corresponding group
    groups[value].push(object);
  });

  return groups;
}
export function getUserPreferences(
  AstroObj: Readonly<AstroGlobal<Record<string, any>>>
): userPreferencesI | undefined {
  if (AstroObj.cookies.has("userPreferences")) {
    const cookie = AstroObj.cookies.get("userPreferences").json();
    return cookie as userPreferencesI;
  }
}
export function getPreferredLangFromHeader(request: Request) {
  if (!request) return baseLocale;
  const langs = request.headers.get("Accept-Language");
  if (!langs) return baseLocale;
  const langsArr = langs.split(",").map((lang) => {
    const arr = lang.split(";");
    return arr[0];
  });
  let preferredLocale = baseLocale; //default
  for (let i = 0; i < langsArr.length; i++) {
    //   let val = item() as i18nDictSubKeysType
    const langKey = langsArr[i];
    const matchedLocale = supportedLanguages.find(
      (locale) => locale.code === langKey
    );
    if (matchedLocale) {
      preferredLocale = langKey;
      break;
    } else continue;
  }
  return preferredLocale;
}
