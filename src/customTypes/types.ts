/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
import type {AttributifyAttributes} from "@unocss/preset-attributify";
import type {Video} from "./Api";

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes {}
  }
}
export interface IVidWithCustom extends Video {
  book: string;
  originalIdx?: number | null;
  slugName?: string | null;
  chapNum?: number | null;
}
