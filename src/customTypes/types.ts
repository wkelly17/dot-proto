/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
import type {Video, VideoSources} from "./Api";

export interface IVidWithCustom extends Video {
  book: string | undefined;
  originalIdx?: number | null;
  slugName?: string | null;
  chapter?: string | null;
  custom_fields: Video["custom_fields"] & {
    book?: string;
    chapter?: string;
    country?: string;
    language?: string;
  };
  sources: customVideoSources[];
  chapterMarkers: chapterMarkers;
}
export interface customVideoSources extends VideoSources {
  src: string;
  name?: string;
  refId?: string;
}

type chapterMarkers = {
  chapterStart: number;
  chapterEnd: number;
  label: string;
  xPos: string;
}[];
export type AnyFunction<Args extends never[], Return> = (
  ...args: Args
) => Return;
export type AnyAsyncFunction<Args extends never[], Return> = (
  ...args: Args
) => Promise<Return>;

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}
export interface userPreferencesI {
  preferUsingSavedVideoIfAvailable?: boolean;
  colorScheme?: "DARK" | "LIGHT";
}
export type cssVariables =
  | "--clrSurface"
  | "--clrBase"
  | "--clrPrimary"
  | "--clrSecondary"
  | "--clrTertiary";

/* 
  [
  {name: "a"
  sources: [
  {size: 10}, {size: 20}, {size:30}
  ]},
  {name: "b"
  sources: [
  {size: 20}, {size: 5}, {size:10}
  ]}
  ]
  
  [
  {size: "biggest", totalSize: NUM}
  {size: "smallet", totalSize: NUM}
  ]
  
  */
