import type {IVidWithCustom} from "@customTypes/types";
import {For} from "solid-js";
import {ChapterButton} from "./ChapterButton";

interface IChapterList {
  videos: IVidWithCustom[];
  formDataRef: HTMLFormElement | undefined;
  chapterButtonOnClick: (IVidWithCustom) => void;
  currentVid: IVidWithCustom;
}
export function ChapterList(props: IChapterList) {
  return (
    <ul class="flex flex-nowrap gap-3 items-start content-start py-4 overflow-x-auto scrollbar-hide  x-scroll-gradient list-none">
      <For each={props.videos}>
        {(vid) => {
          return (
            <li>
              <ChapterButton
                currentVid={props.currentVid}
                vid={vid}
                formDataRef={props.formDataRef}
                onClick={(vid) => props.chapterButtonOnClick(vid)}
              />
            </li>
          );
        }}
      </For>
    </ul>
  );
}
