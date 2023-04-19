import {createSignal, Show, createEffect} from "solid-js";
import type {Setter} from "solid-js";
import {
  setPlayerSrc,
  playerSrc,
  selectForDownload,
  manageSelectedLink,
  batchDownloadHref,
} from "../lib/store";
import {
  formatDuration,
  getMp4DownloadSize,
  convertToValidFilename,
} from "../utils";

interface thumbnailProps {
  img: string;
  vid: any;
  id: string;
  idx: number;
}
export function Thumbnail(props: thumbnailProps) {
  // THE MP4 SOURCE FOR BATCH DOWNLOADING. JUST USE THE FIRST MP4 AVAILABLED
  const mp4s = props.vid.sources.filter((v: any) => {
    return v.container && v.container == "MP4";
  });
  const mp4Src = mp4s[0].src;
  const mp4Size = mp4s[0].size;
  // FOR DOWNLOADING AND FILENAMES
  const vidNameSlugified = convertToValidFilename(props.vid.name);

  function manageSource(src: string) {
    const mp4s = props.vid.sources.filter((v: any) => {
      return v.container && v.container == "MP4";
    });
    const newSources = props.vid.sources;
    const vidId = props.id;
    // debugger;
    // setPlayerSrc(useableSrc[0]);
    // setPlayerSrc(props.idx);
    setPlayerSrc(props.vid);
  }
  return (
    <li class="flex gap-2 bg-neutral-200 class relative items-stretch content-stretch my-2">
      <button
        class="absolute w-full h-full"
        onClick={() => manageSource(props.img)}
        aria-label="switch to this video"
      />
      <div class="w-1/3">
        <img
          class="h-full object-cover"
          loading="lazy"
          src={props.img}
          alt=""
        />
      </div>
      <div class="flex justify-between p-2 flex-grow-1">
        <div class="flex flex-col justify-center">
          <p>{props.vid.name}</p>
          <p>Duration {formatDuration(props.vid.duration)}</p>
          <p>Size: {getMp4DownloadSize(props.vid)} MB</p>
        </div>
        <Show when={selectForDownload()}>
          <label
            class="absolute w-full h-full left-0"
            aria-label="Select to add video to download list"
          >
            <input
              class="relative z-10 rounded-full w-4 h-4 align-middle bg-white appearance-none checked:bg-blue-700 ml-auto block mr-1"
              type="checkbox"
              onchange={(e) =>
                manageSelectedLink(e, mp4Src, vidNameSlugified, mp4Size)
              }
            />
          </label>
        </Show>
      </div>
    </li>
  );
}
