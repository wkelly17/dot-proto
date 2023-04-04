import {createSignal, Show} from "solid-js";
import type {Setter} from "solid-js";
import {
  setPlayerSrc,
  playerSrc,
  batchDownloadHref,
  setFilterQuery,
} from "../lib/store";
import {selectForDownload, setSelectForDownload} from "../lib/store";
import {padLastNumber} from "../utils";

interface sideBarPropsI {}
export function DownloadToggle(props: any) {
  function normalizeAndSetSearchQuery(value: string) {
    return setFilterQuery(value.toLowerCase().normalize());
  }

  return (
    <>
      <button
        class="block  py-2 px-1 border bg-neutral-100 shadow"
        onClick={(e) => setSelectForDownload(!selectForDownload())}
      >
        Choose videos to download
      </button>
      <label>
        Search
        <input
          class="border border-red-400 px-2 py-1 my-2 ml-2"
          type="text"
          onInput={(e) => {
            normalizeAndSetSearchQuery(e.target?.value);
          }}
        />
      </label>
      <Show when={batchDownloadHref()}>
        {/* <a href={batchDownloadHref()}>Download Selected</a> */}
        <form action={batchDownloadHref()} method="post">
          <button>Dowload Selected Videos</button>
        </form>
      </Show>
    </>
  );
}

// 2test.zip?src=%5B%22http%3A%2F%2Fbcbolt446c5271-a.akamaihd.net%2Fmedia%2Fv1%2Fpmp4%2Fstatic%2Fclear%2F6314154063001%2Ff3437ce6-453f-4cd3-b3a7-92d21acce8b1%2F7e83e6f0-c21b-4beb-9152-946858b7ccf7%2Fmain.mp4%3Fakamai_token%3Dexp%3D1678137712~acl%3D%2Fmedia%2Fv1%2Fpmp4%2Fstatic%2Fclear%2F6314154063001%2Ff3437ce6-453f-4cd3-b3a7-92d21acce8b1%2F7e83e6f0-c21b-4beb-9152-946858b7ccf7%2Fmain.mp4*~hmac%3Ddf0357ec966aaa7dce501dfe13c26fb7a62b582784d43b3448b78fe64079b4b9%22%5D&names=%5B%22Matthieu_01%22%5D&size=146836894
