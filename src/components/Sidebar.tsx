import {
  createSignal,
  For,
  Show,
  createMemo,
  onMount,
  createEffect,
} from "solid-js";

import {
  setPlayerSrc,
  playerSrc,
  batchDownloadHref,
  filteredPlaylist,
  setAllVideos,
} from "../store";
import {selectForDownload, setSelectForDownload} from "../store";
import {Thumbnail} from "./Thumbnail";

interface sideBarPropsI {
  videos: any[];
  vidsByBook: object[][];
}
export function Sidebar(props: sideBarPropsI) {
  const [videosToRender, setVideosToRender] = createSignal(props.vidsByBook);

  setAllVideos(props.vidsByBook);

  createEffect(() => {
    const vids = filteredPlaylist() ? filteredPlaylist() : props.vidsByBook;
    setVideosToRender(vids);
  });

  return (
    <>
      <nav>
        {/* <ul class="grid gap-2">
          <For
            each={videosToRender()}
            fallback={<div> No results for this search...</div>}
          >
            {(vid, index) => (
              <Thumbnail
                idx={vid.originalIdx}
                img={vid.thumbnail}
                vid={vid}
                id={vid.id}
              />
            )}
          </For>
        </ul> */}
        <ul class="grid gap-2">
          <For
            each={videosToRender()}
            fallback={<div> No results for this search...</div>}
          >
            {(group, index) => (
              <details open class="">
                <summary>{group[0]?.book || "no title"}</summary>{" "}
                <For each={group}>
                  {(vid, index) => (
                    <Thumbnail
                      idx={vid.originalIdx}
                      img={vid.thumbnail}
                      vid={vid}
                      id={vid.id}
                    />
                  )}
                </For>
              </details>
            )}
          </For>
        </ul>
      </nav>
    </>
  );
}
