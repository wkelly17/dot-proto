/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
import type {Video} from "./Api";

export interface IVidWithCustom extends Video {
  book: string;
  originalIdx?: number | null;
  slugName?: string | null;
  chapNum?: number | null;
}
