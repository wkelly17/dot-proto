import type {
  IVidWithCustom,
  customVideoSources,
  userPreferencesI,
} from "@customTypes/types";
import {mobileHorizontalPadding, CONTAINER, debounce, setCookie} from "@lib/UI";
import {
  playerLoader,
  downloadPreference,
  setDownloadPreference,
} from "@lib/store";
import {For, Show, createSignal, onMount} from "solid-js";
import {H1, H2} from "@components/Heading";
import {LoadingSpinner} from "@components/Icons";
import type {VideoJsPlayer} from "video.js";
// import {Select} from "@components/DownloadSelect";
import {RadioGroup, Select, Switch} from "@kobalte/core";
// first poster with button that looks like play button
// vid data not loaded until a chapter is picked
// chapter picked => instantiate module
interface IVidPlayerProps {
  vids: Record<string | number | symbol, IVidWithCustom[]>;
  playlist: string | undefined;
  initialData: {
    vids: IVidWithCustom[];
    chap: IVidWithCustom;
  };
  userPreferences: userPreferencesI | null;
}
export function VidPlayer(props: IVidPlayerProps) {
  console.log(props.userPreferences);
  const [currentVid, setCurrentVid] = createSignal(props.initialData.chap);
  const [currentBook, setCurrentBook] = createSignal(props.initialData.vids);
  const [currentChapLabel, setCurrentChapLabel] = createSignal("");
  const [vjsPlayer, setVjsPlayer] = createSignal<VideoJsPlayer>();
  let player: HTMLDivElement | undefined;
  let formDataRef: HTMLFormElement | undefined;

  function changeVid(chapNum: string | null | undefined) {
    const newVid = currentBook().find((vid) => vid.chapter == chapNum);
    if (newVid) {
      setCurrentVid(newVid);
    }
  }
  function normalizeBookName(bookname: string) {
    if (!bookname) return;
    const parts = bookname.split(/(\d+)/).filter((r) => !!r); // Split on any digits
    if (parts.length > 1) {
      const secondPart = upperFirstLowerRest(parts[1]);
      return `${parts[0]} ${secondPart}`;
    } else return upperFirstLowerRest(bookname);
  }
  function jumpToNextChap(dir: "NEXT" | "PREV") {
    const currentTime = vjsPlayer()?.currentTime();
    if (!currentTime) return;

    if (dir == "NEXT") {
      const nextStart = currentVid().chapterMarkers?.find(
        (marker) => marker.chapterStart > currentTime
      );
      if (nextStart) {
        vjsPlayer()?.currentTime(nextStart.chapterStart);
      }
    } else if (dir == "PREV") {
      const candidates = currentVid().chapterMarkers?.filter(
        (marker) => marker.chapterEnd < currentTime
      );
      const prevStart = candidates.reduce((acc, current) => {
        return acc.chapterEnd > current.chapterEnd ? acc : current;
      });
      if (prevStart) {
        vjsPlayer()?.currentTime(prevStart.chapterStart);
      }
    }
  }
  // function isAdjacentChap(dir: "NEXT" | "PREV")
  function upperFirstLowerRest(bookName: string) {
    return `${bookName.slice(0, 1).toUpperCase()}${bookName
      .slice(1)
      .toLowerCase()}`;
  }
  function formatPlayListName(playlist: string | undefined) {
    if (!playlist) return;
    const parts = playlist.split("-");
    const cased = parts.map((part) => upperFirstLowerRest(part));
    return cased.join(" ");
  }
  function setNewBook(vids: IVidWithCustom[]) {
    setCurrentBook(vids);
    const firstBook = vids[0];
    setCurrentVid(firstBook);
    changePlayerSrc(firstBook);
  }
  function convertTimeToSeconds(timeStr: string): number {
    const [mins, secs] = timeStr.split(":").map(Number);
    const milliseconds = Number(timeStr.split(".")[1]);
    return mins * 60 + secs + milliseconds / 1000;
  }
  async function changePlayerSrc(vid: IVidWithCustom) {
    if (!vjsPlayer()) return;

    changeVid(vid.chapter);
    vid.sources && vjsPlayer()?.src(vid.sources);
    vid.poster && vjsPlayer()?.poster(vid.poster);
    vjsPlayer()?.load();
    vjsPlayer()?.one("loadedmetadata", (e) => {
      getChaptersArrFromVtt(vid);
    });
  }
  function cleanUpOldChapters() {
    const elements = document.querySelectorAll('[data-role="chapterMarker"]');
    elements.forEach((element) => {
      element.remove();
    });
  }
  async function getChaptersArrFromVtt(vid: IVidWithCustom) {
    cleanUpOldChapters();
    const chapterObj = vid.text_tracks?.find((tt) => tt.kind === "chapters");
    if (!chapterObj || !chapterObj.src) return;
    if (vid.chapterMarkers) return;
    const plyr = vjsPlayer();
    if (!plyr) return;
    const chapterVttRes = await fetch(chapterObj.src);
    const chapterVtt = await chapterVttRes.text();
    // todo: move assigning of dom nodes into separate function so that this is only repsonsible for creating or return the vtt array
    const vttChapsArray = chapterVtt
      .split("\n\n")
      .filter((segment) => segment.includes("-->"))
      .map((chapter) => {
        const parts = chapter.split("\n");
        const timeStamp = parts[0].split("-->");
        const startTime = convertTimeToSeconds(timeStamp[0]);
        const endTime = convertTimeToSeconds(timeStamp[1]);
        const totalDur = plyr.duration()!;
        const xPos = String((startTime / totalDur) * 100);
        const chapMarker = <ChapterMarker leftAmt={xPos} />;
        const sb = plyr.controlBar.progressControl.seekBar.el();
        sb.appendChild(chapMarker);
        return {
          chapterStart: startTime,
          chapterEnd: endTime,
          label: parts[1],
          xPos: xPos,
        };
      });
    vid.chapterMarkers = vttChapsArray;
  }
  function getChapterText(timeInSeconds: number) {
    if (!currentVid().chapterMarkers) return;
    const currentChap = currentVid().chapterMarkers.find((marker) => {
      return (
        timeInSeconds >= marker.chapterStart &&
        timeInSeconds < marker.chapterEnd
      );
    });
    if (!currentChap) return;
    return currentChap.label;
  }

  function formatTimeStamp(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const roundedSeconds = Math.round(seconds % 60);

    let timeString = "";
    if (hours > 0) {
      timeString += hours.toString().padStart(2, "0") + ":";
    }
    timeString += minutes.toString().padStart(2, "0") + ":";
    timeString += roundedSeconds.toString().padStart(2, "0");

    return timeString;
  }
  function formatBytesToKb(bits: number | undefined) {
    if (!bits) return "";
    const kilobytes = bits / 1000;
    return kilobytes;
  }

  function formatKbToMb(bytes: number | undefined, intl: boolean) {
    if (!bytes) return "";
    const val = Math.round(bytes / 1000 / 1000);
    if (!intl) return String(val);
    return new Intl.NumberFormat().format(val);
  }
  function formatAvgBitRate(bitrate: number | undefined) {
    if (!bitrate) return;
    return new Intl.NumberFormat().format(bitrate);
  }

  async function getThumbImagesArr(vid: IVidWithCustom) {
    // lcl: Works to get list of images.  But I wonder if I could parse it more simply wo a package?
    //todo: yes.. just splitting for thumbnail images should work.
    // const thumbnails = vid.text_tracks?.find((tt) => tt.label == "thumbnails");
    // const file = await fetch(thumbnails.src);
    // const vttText = await file.text();
    // // const tree = parser.parse(vttText, "metadata");
    // const thing = vttText
    //   .split("\n\n")
    //   .filter((segment) => segment.includes("\n"))
    //   .map(function (item) {
    //     const parts = item.split("\n");
    //     return {
    //       startTime: convertTimeToSeconds(parts[0].split("-->")[0]),
    //       endTime: convertTimeToSeconds(parts[0].split("-->")[1]),
    //       imgUrl: parts[1],
    //     };
    //   });
  }
  function SeekBarChapterText() {
    return (
      <span data-role="chapLabelTextHolder" class="hidden chapLabelTextHolder">
        {currentChapLabel()}
      </span>
    );
  }
  function ChapterMarker(props: {leftAmt: string}) {
    return (
      <span
        data-role="chapterMarker"
        class="w-1 h-full inline-block bg-primary absolute"
        style={{left: `${props.leftAmt}%`}}
      />
    );
  }
  const downloadUrl = () => {
    if (!currentVid()) return;
    const mp4Src = currentVid().sources?.find(
      (source) => source.container === "MP4"
    );
    if (!mp4Src) return;
    // // 2test.zip?src=${href}&names=${namesHref}&size=${size}
    const encoded = `2test.zip?src=${encodeURIComponent(
      JSON.stringify([mp4Src.src])
    )}&names=${encodeURIComponent(
      JSON.stringify([currentVid().reference_id])
    )}&size=${mp4Src.size}`;
    return encoded;
  };
  const wholeBookUrls = () => {
    if (!currentBook()) return;

    const mp4SrcObjects = currentBook().reduce(
      (acc: customVideoSources[], curr) => {
        const mp4 = curr.sources?.find((src) => src.container === "MP4");
        if (!mp4) return acc;
        mp4.name = `${curr.book}-${curr.chapter}`;
        acc.push(mp4);
        return acc;
      },
      []
    );

    type accType = {
      sources: string[];
      names: string[];
      size: number;
    };
    if (!mp4SrcObjects || !mp4SrcObjects.length) return;
    const parts = mp4SrcObjects.reduce(
      (acc: accType, current) => {
        acc.sources.push(current.src);
        current.name && acc.names.push(current.name);
        if (current.size) {
          acc.size += current.size;
        }
        return acc;
      },
      {
        sources: [],
        names: [],
        size: 0,
      }
    );
    const encodedUrl = `2test.zip?src=${encodeURIComponent(
      JSON.stringify(parts.sources)
    )}&names=${encodeURIComponent(JSON.stringify(parts.names))}&size=${
      parts.size
    }`;
    return encodedUrl;
  };
  type wholeBookUrlsSpecificParams = {
    size?: number;
    preset?: "BIG" | "SMALL";
  };
  const wholeBookUrlsSpecific = ({
    size,
    preset,
  }: wholeBookUrlsSpecificParams) => {
    if (!currentBook()) return;
    const mp4SrcObjects = currentBook().reduce(
      (acc: customVideoSources[], curr) => {
        const mp4 = curr.sources?.find(
          (src) => src.container === "MP4" && src.height == size
        );
        if (!mp4) return acc;
        mp4.name = `${curr.book}-${curr.chapter}`;
        mp4.refId = String(curr.reference_id);
        acc.push(mp4);
        return acc;
      },
      []
    );

    if (!mp4SrcObjects || !mp4SrcObjects.length) return;
    type accType = {
      sources: string[];
      names: string[];
      size: number;
      refIds: string[];
    };
    const parts = mp4SrcObjects.reduce(
      (acc: accType, current) => {
        acc.sources.push(current.src);
        current.name && acc.names.push(current.name);
        current.refId && acc.refIds.push(current.refId);
        if (current.size) {
          acc.size += current.size;
        }
        return acc;
      },
      {
        sources: [],
        refIds: [],
        names: [],
        size: 0,
      }
    );
    const encodedUrl = `sw-save.zip?src=${encodeURIComponent(
      JSON.stringify(parts.sources)
    )}&names=${encodeURIComponent(
      JSON.stringify(parts.names)
    )}&refids=${encodeURIComponent(JSON.stringify(parts.refIds))}&size=${
      parts.size
    }`;
    return encodedUrl;
  };

  const wholeBooksOptionsForSelect = ({
    size,
    preset,
  }: wholeBookUrlsSpecificParams) => {
    if (!currentBook()) return;

    // {name:"higher quality", [srcs]}
    const mp4SrcObjects = currentBook().reduce(
      (acc: customVideoSources[], curr) => {
        const mp4s = curr.sources?.filter((src) => src.container === "MP4");
        let srcToUse = mp4s[0];
        if (preset === "BIG") {
          srcToUse = mp4s.reduce((maxObject, currentObject) => {
            if (!maxObject.size) return currentObject;
            if (!currentObject.size) return maxObject;
            if (!maxObject) {
              maxObject = currentObject;
              return maxObject;
            }
            if (currentObject.size > maxObject.size) {
              return currentObject;
            } else {
              return maxObject;
            }
          });
        } else if (preset === "SMALL") {
          srcToUse = mp4s.reduce((minObject, currentObject) => {
            if (!minObject.size) return currentObject;
            if (!currentObject.size) return minObject;
            if (!minObject) {
              minObject = currentObject;
              return minObject;
            }
            if (currentObject.size < minObject.size) {
              return currentObject;
            } else {
              return minObject;
            }
          });
        }
        if (!srcToUse) return acc;
        srcToUse.name = `${curr.book}-${curr.chapter}`;
        srcToUse.refId = String(curr.reference_id);
        acc.push(srcToUse);
        return acc;
      },
      []
    );

    if (!mp4SrcObjects || !mp4SrcObjects.length) return;
    return mp4SrcObjects;
  };
  const wholeBooksOptionsForSelect2 = () => {
    if (!currentBook()) return;

    const largestSizes = currentBook().map((obj) =>
      Math.max(...obj.sources.map((src) => (src.size ? src.size : 0)))
    );
    const smallestSizes = currentBook().map((obj) =>
      Math.min(
        ...obj.sources
          .filter((src) => !!src.size)
          .map((src) => (src.size ? src.size : Infinity))
      )
    );
    const totalSizeOfLargest = largestSizes.reduce(
      (sum, size) => sum + size,
      0
    );
    const totalSizeOfSmallest = smallestSizes.reduce(
      (sum, size) => sum + size,
      0
    );

    const result = [
      {
        size: "biggest",
        totalSize: totalSizeOfLargest,
        wholeBooksOptionsForSelectId: "BIG",
      },
      {
        size: "smallest",
        totalSize: totalSizeOfSmallest,
        wholeBooksOptionsForSelectId: "SMALL",
      },
    ];
    return result;
  };

  const currentMp4Sources = () => {
    const mp4Srces = currentVid().sources?.filter(
      (source) => source.container === "MP4"
    );
    const dedupedSizeChecker: number[] = [];
    const dedupedMp4s = mp4Srces.filter((src) => {
      if (!src.size) return false;
      if (dedupedSizeChecker.includes(src.size)) {
        return false;
      } else {
        src.size && dedupedSizeChecker.push(src.size);
        return true;
      }
    });
    return dedupedMp4s;
  };

  // console.log(currentMp4Sources());

  function downloadSingle() {
    return (
      // <Show when={downloadUrl()} fallback={<span> X</span>}>
      <form method="post" action={downloadUrl()} class="flex">
        <button>D</button>
      </form>
      // </Show>
    );
  }
  function downloadMultipleBtn() {
    return (
      // <form method="post" action={wholeBookUrls()} class="flex">
      //   <button>W</button>
      // </form>
      <form method="post" action="" class="flex">
        <button>W</button>
      </form>
    );
  }
  async function playFromSw() {
    const refId = currentVid().reference_id;
    if (!refId) return;
    const cacheMatch = await caches.match(refId);
    if (!cacheMatch) return;

    const blob = await cacheMatch.blob();
    const staticUrl = URL.createObjectURL(blob);
    vjsPlayer()?.src({
      type: "video/mp4",
      src: staticUrl,
    });
    vjsPlayer()?.play();
  }
  function customHotKeys(e: KeyboardEvent) {
    const player = vjsPlayer();
    if (!player) return;
    const currentTime = player.currentTime();
    switch (e.key) {
      case "ArrowLeft":
        player.currentTime(currentTime - 5);
        break;
      case "ArrowRight":
        player.currentTime(currentTime + 5);
        break;
      default:
        break;
    }
  }

  function populateSwPayload(val: string) {
    if (downloadPreference().justThisVideo) {
      const matching = currentMp4Sources().find(
        (source) => String(source.size) === val
      );
      setDownloadPreference((prev) => {
        console.log({...prev, swPayload: [matching]});
        return {
          ...prev,
          swPayload: [matching],
        };
      });
    } else {
      const videoSources = wholeBooksOptionsForSelect({preset: val});
      setDownloadPreference((prev) => {
        console.log({
          ...prev,
          swPayload: videoSources,
        });
        return {
          ...prev,
          swPayload: videoSources,
        };
      });
    }
  }
  function selectValueOption() {
    if (downloadPreference().justThisVideo) {
      return;
    } else {
      return;
    }
  }
  onMount(async () => {
    // setCookie(
    //   "user",
    //   JSON.stringify({
    //     useSavedVid: true,
    //   })
    // );
    console.log("cookie set");
    // Todo: replace the state when moving beyond each chapter chunk?
    // setTimeout(() => {
    //   history.pushState(null, "", `${location.href}?q=t`);
    // }, 5000);
    const playerModule = await import("@brightcove/player-loader");

    const options = {
      refNode: player,
      refNodeInsert: "replace",
      accountId: 6314154063001,
      playerId: "9mlrvmAybr",
      controls: true,
      // embedType: "iframe",
      embedType: "in-page",
      options: {
        responsive: true,
        fluid: true,
        // aspectRatio: "1:1",
        fill: true,
        controls: true,
        playbackRates: [0.5, 1, 1.5, 2, 2.5],
        preload: "auto",
      },
      // playlistId: "ref:benin-new-testament",
      // id: 6312743832112,
      videoId: currentVid().id,
      embedOptions: {
        // playlist: true,
        // responsive: {
        //   aspectRatio: "1:1",
        // },
      },
    };
    const vPlayer = await playerModule.default(options);
    // set
    // const spacer = vPlayer.ref.controlBar.customControlSpacer.el();
    const newElement = document.createElement("button");
    newElement.textContent = "D";
    newElement.id = "findme";
    // Place the new element in the spacer
    // debugger;
    // vPlayer.ref.controlBar.el().appendChild(downloadSingle());
    vPlayer.ref.playsinline(true);
    console.log(vPlayer.ref);
    vPlayer.ref.on("keydown", (e: KeyboardEvent) => customHotKeys(e));
    setVjsPlayer(vPlayer.ref);

    vPlayer.ref.one("loadedmetadata", () => {
      getChaptersArrFromVtt(currentVid());
    });
    const seekBar = vPlayer.ref.controlBar.progressControl.seekBar;
    const currentToolTip = document.querySelector(
      ".vjs-progress-control .vjs-mouse-display"
    ) as Element;
    const seekBarEl = (<SeekBarChapterText />) as Node;
    currentToolTip.appendChild(seekBarEl);
    const handleProgressHover = debounce((event) => {
      const distance = seekBar.calculateDistance(event);
      const totalDur = vPlayer.ref.duration();
      const time = distance * totalDur;
      const chapLabel = getChapterText(time);
      if (chapLabel && currentToolTip) {
        setCurrentChapLabel(chapLabel);
      }
    }, 10);
    seekBar.on("mouseover", handleProgressHover);
  });

  return (
    <>
      <div
        class={`grid grid-rows-[auto_auto_1fr] h-full overflow-y-auto overflow-x-hidden ${CONTAINER} sm:(rounded-lg w-full)`}
      >
        <div class="relative" data-title="vidPoster">
          <div class="relative">
            <div class="aspect-12/9 sm:aspect-video sm:(rounded-lg overflow-hidden)">
              <div
                ref={player}
                id="PLAYER"
                class="w-full h-full grid place-content-center"
              >
                <LoadingSpinner classNames="w-16 h-16 text-primary" />
              </div>
            </div>
            <form
              action=""
              name="downloadData"
              ref={formDataRef}
              class="flex flex-col gap-2"
            >
              <Switch.Root
                defaultIsChecked={downloadPreference().downloadOffline}
                name="downloadData"
                class="switch"
                onCheckedChange={(isChecked) =>
                  setDownloadPreference((prev) => {
                    return {
                      ...prev,
                      downloadOffline: isChecked,
                    };
                  })
                }
              >
                <Switch.Label class="switch__label">
                  Download To Device
                </Switch.Label>
                <Switch.Input class="switch__input" />
                <Switch.Control class="w-12 h-6 rounded-full bg-surface/20 grid place-content-center relative p-2 relative data-[checked]:(bg-primary/30)">
                  <Switch.Thumb class="rounded-full h-full w-1/2 absolute left-0 bg-surface/10 transition duration-150 data-[checked]:text-primary/80 data-[checked]:(translate-x-100% bg-primary)" />
                </Switch.Control>
              </Switch.Root>
              <Switch.Root
                class="switch"
                name="downloadData"
                onCheckedChange={(isChecked) =>
                  setDownloadPreference((prev) => {
                    return {
                      ...prev,
                      saveToServiceWorker: isChecked,
                    };
                  })
                }
              >
                <Switch.Label class="switch__label">Save offline</Switch.Label>
                <Switch.Input class="switch__input" />
                <Switch.Control class="w-12 h-6 rounded-full bg-surface/20 grid place-content-center relative p-2 relative data-[checked]:(bg-primary/30)">
                  <Switch.Thumb class="rounded-full h-full w-1/2 absolute left-0 bg-surface/10 transition duration-150 data-[checked]:text-primary/80 data-[checked]:(translate-x-100% bg-primary)" />
                </Switch.Control>
              </Switch.Root>
              <RadioGroup.Root
                class="radio-group"
                name="downloadData"
                defaultValue={"chapter"}
                onValueChange={(val) =>
                  setDownloadPreference((prev) => {
                    console.log({prev});
                    const newVal = {
                      ...prev,
                      swPayload: null,
                      justThisVideo: val == "book" ? false : true,
                    };
                    return newVal;
                  })
                }
              >
                <RadioGroup.Label class="radio-group__label">
                  Download Scope
                </RadioGroup.Label>
                <div class="">
                  <For
                    each={[
                      {text: "Whole Book", val: "book"},
                      {text: "Just this video", val: "chapter"},
                    ]}
                  >
                    {(opt) => (
                      <RadioGroup.Item value={opt.val} class="flex gap-2">
                        <RadioGroup.ItemInput class="radio__input" />
                        <RadioGroup.ItemControl class="w-6 h-6 rounded-full bg-surface/20 grid place-content-center relative p-2">
                          <RadioGroup.ItemIndicator class="absolute w-3/5 h-3/5 inset-20% rounded-full block bg-primary" />
                        </RadioGroup.ItemControl>
                        <RadioGroup.ItemLabel class="radio__label">
                          {opt.text}
                        </RadioGroup.ItemLabel>
                      </RadioGroup.Item>
                    )}
                  </For>
                </div>
              </RadioGroup.Root>
              <Show when={downloadPreference().justThisVideo}>
                <Select.Root
                  // name="downloads"
                  name="downloadData"
                  flip={false}
                  hideWhenDetached={true}
                  options={currentMp4Sources()}
                  // Can't stringify form state in a select, and want to pass as a single form url encoded string anway, so take the size, look it up in the current Mp4 Source create [{}] or multiple [{}, {}] stringifed in an input
                  onValueChange={(val) => populateSwPayload(val)}
                  optionValue={(val) => String(val.size)}
                  optionTextValue={(val) => formatKbToMb(val.size, true)}
                  placeholder="Select video quality"
                  valueComponent={(props) =>
                    formatKbToMb(props.item.rawValue.size, true)
                  }
                  itemComponent={(props) => (
                    <Select.Item
                      item={props.item}
                      class={`text-surface  data-[selected]:text-primary/80 hover:bg-primary/20 px-2`}
                    >
                      <Select.ItemLabel>
                        {formatKbToMb(props.item.rawValue.size, true)}mb
                      </Select.ItemLabel>
                    </Select.Item>
                  )}
                >
                  {/* <Select.HiddenSelect /> */}
                  <Select.Trigger
                    aria-label="Mp4 Quality"
                    class="inline-flex items-center justify-between w-60 rounded-md py-2 pl-2 pr-4 text-surface/90 bg-surface/10 border border-surface/20 hover:border-surface/30 transition-colors duration-150"
                  >
                    <Select.Value class="text-ellipsis whitespace-nowrap overflow-hidden data-[placeholder-shown]:text-surface/80" />
                    <Select.Icon class="text-surface/90 w-6 h-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 256 256"
                      >
                        <path
                          fill="currentColor"
                          d="M181.66 170.34a8 8 0 0 1 0 11.32l-48 48a8 8 0 0 1-11.32 0l-48-48a8 8 0 0 1 11.32-11.32L128 212.69l42.34-42.35a8 8 0 0 1 11.32 0Zm-96-84.68L128 43.31l42.34 42.35a8 8 0 0 0 11.32-11.32l-48-48a8 8 0 0 0-11.32 0l-48 48a8 8 0 0 0 11.32 11.32Z"
                        />
                      </svg>
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content class={`text-surface/90  bg-base border`}>
                      <Select.Listbox class="py-4 max-h-[300px] overflow-y-auto" />
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </Show>
              <Show when={!downloadPreference().justThisVideo}>
                <Select.Root
                  // name="downloads"
                  name="downloadData"
                  flip={false}
                  hideWhenDetached={true}
                  options={wholeBooksOptionsForSelect2()}
                  onValueChange={(val) => populateSwPayload(val)}
                  optionValue={(val) => val.wholeBooksOptionsForSelectId}
                  optionTextValue={(val) => val.size}
                  placeholder="Select playlist quality"
                  valueComponent={(props) => props.item.rawValue.size}
                  itemComponent={(props) => (
                    <Select.Item
                      item={props.item}
                      class={`text-surface  data-[selected]:text-primary/80 hover:bg-primary/20 px-2`}
                    >
                      <Select.ItemLabel>
                        {formatKbToMb(props.item.rawValue.totalSize, true)}mb
                      </Select.ItemLabel>
                      {/* <Select.ItemIndicator>C</Select.ItemIndicator> */}
                    </Select.Item>
                  )}
                >
                  {/* <Select.HiddenSelect /> */}
                  <Select.Trigger
                    aria-label="Mp4 Quality"
                    class="inline-flex items-center justify-between w-60 rounded-md py-2 pl-2 pr-4 text-surface/90 bg-surface/10 border border-surface/20 hover:border-surface/30 transition-colors duration-150"
                  >
                    <Select.Value class="text-ellipsis whitespace-nowrap overflow-hidden data-[placeholder-shown]:text-surface/80" />
                    <Select.Icon class="text-surface/90 w-6 h-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 256 256"
                      >
                        <path
                          fill="currentColor"
                          d="M181.66 170.34a8 8 0 0 1 0 11.32l-48 48a8 8 0 0 1-11.32 0l-48-48a8 8 0 0 1 11.32-11.32L128 212.69l42.34-42.35a8 8 0 0 1 11.32 0Zm-96-84.68L128 43.31l42.34 42.35a8 8 0 0 0 11.32-11.32l-48-48a8 8 0 0 0-11.32 0l-48 48a8 8 0 0 0 11.32 11.32Z"
                        />
                      </svg>
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content class={`text-surface/90  bg-base border`}>
                      <Select.Listbox class="py-4 max-h-[300px] overflow-y-auto" />
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </Show>
            </form>
            {/* todo */}
            <form action="2test.zip?" method="post" name="downloads">
              <input
                type="hidden"
                name="swPayload"
                value={JSON.stringify(downloadPreference().swPayload)}
              />
              <input
                type="hidden"
                name="swDownloadDevice"
                value={String(downloadPreference().downloadOffline)}
              />
              <input
                type="hidden"
                name="swSaveSw"
                value={String(downloadPreference().saveToServiceWorker)}
              />
              <Show
                when={
                  (downloadPreference().saveToServiceWorker ||
                    downloadPreference().downloadOffline) &&
                  downloadPreference().swPayload
                }
              >
                <button class="dark:(bg-surface/10 border border-primary/80) px-4 py-2 rounded">
                  Submit
                </button>
              </Show>
            </form>
          </div>
          <div
            class="overflow-x-auto scrollbar-hide min-h-150px"
            title="chapterNums"
          >
            {/* bggr-linear-gradient(90deg,rgba(0,0,0,0.9)1%,rgba(0,0,0,0),3%,_rgba(0,0,0,0)_97%,_rgba(0,0,0,0.6)_99%) */}
            <ul class="flex flex-nowrap gap-3 items-start content-start py-4 overflow-x-auto scrollbar-hide  x-scroll-gradient">
              <For each={currentBook()}>
                {(vid) => {
                  return (
                    <li>
                      <button
                        onClick={() => {
                          formDataRef && formDataRef.reset();
                          changePlayerSrc(vid);
                        }}
                        class={`rounded-full h-8 w-8 inline-grid place-content-center text-center flex-shrink-0 bg-neutral-400 dark:bg-neutral-600 text-white sm:(w-12 h-12) hover:(bg-primary/70 transition scale-110) active:(scale-95) ${
                          vid.chapter === currentVid().chapter
                            ? "bg-neutral-800 dark:bg-neutral-900 transform scale-120  transition-colors duration-200"
                            : ""
                        }`}
                      >
                        {Number(vid.chapter)}
                      </button>
                    </li>
                  );
                }}
              </For>
            </ul>
            <div class={`${mobileHorizontalPadding} sm:(py-4)`}>
              <H1 classes="font-bold">
                {normalizeBookName(currentVid().book)}
              </H1>
              <p>{formatPlayListName(props.playlist)}</p>
            </div>
          </div>
          <div
            title="bookSelection"
            class={`${mobileHorizontalPadding} py-2 bg-primary dark:bg-surface/05 text-base rounded-tr-xl rounded-tl-xl overflow-y-hidden scrollbar-hide min-h-200px md:h-max`}
          >
            <H2 classes="text-neutral-100 dark:text-neutral-200">
              Bible Selection
            </H2>
            <p class="text-neutral-100 dark:text-neutral-200">
              Choose a book of the bible to watch here.
            </p>
            <div class="relative h-full sm:h-auto">
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  "pointer-events": "none",
                  height: "100%",
                }}
                class="y-scroll-gradient sm:(hidden)"
              />
              <ul class="h-full overflow-y-auto scrollbar-hide pt-8 pb-36 sm:(max-h-[50vh])">
                <For each={Object.entries(props.vids)}>
                  {([key, book], idx) => {
                    return (
                      <li class="text-neutral-100 dark:text-neutral-200 py-1 w-full border-y border-base md:(text-lg py-2)">
                        <button
                          onClick={() => setNewBook(book)}
                          class="inline-flex gap-2 items-center hover:(text-surface font-bold underline)"
                        >
                          <span class="bg-base text-primary dark:text-primary rounded-full p-4 h-0 w-0 inline-grid place-content-center">
                            {idx() + 1}
                          </span>
                          {normalizeBookName(key)}
                        </button>
                      </li>
                    );
                  }}
                </For>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//  <div id="qualityCompared" class={`w-full ${CONTAINER}`}>
//         <For each={currentMp4Sources()}>
//           {(src) => {
//             return (
//               <div class="w-full">
//                 <p>Meta:</p>
//                 <ul>
//                   <li>
//                     avg_bitrate: {formatAvgBitRate(src.avg_bitrate)}
//                     or {formatBytesToKb(src.avg_bitrate)} KBs
//                   </li>
//                   <li>
//                     size {src.size} or {formatKbToMb(src.size, true)} mb
//                   </li>
//                   <li>width {src.width}</li>
//                   <li>
//                     Download:
//                     <form
//                       method="post"
//                       action={`2test.zip?src=${encodeURIComponent(
//                         JSON.stringify([src.src])
//                       )}&names=${encodeURIComponent(
//                         JSON.stringify([currentVid().reference_id])
//                       )}&size=${src.size}`}
//                       class="flex"
//                     >
//                       <button class="p-2 rounded-sm bg-green-800 text-white hover:bg-green-700 active:transform active:scale-98">
//                         Download This one
//                       </button>
//                         const encoded = ``;
//             </form>
//             </li>

//             <li>
//               Download whole book this size
//               <form
//                 method="post"
//                 // action={`${wholeBookUrlsSpecific({size: src.height})}`}
//                 action={""}
//                 class="flex"
//               >
//                 <button class="p-2 rounded-sm bg-green-800 text-white hover:bg-green-700 active:transform active:scale-98">
//                   Download Whole
//                 </button>
//                 {/*   const encoded = ``; */}
//               </form>
//               <button
//                 class="my-2 bg-green-700 active:bg-green-600"
//                 // onClick={async () => {
//                 //   const url = wholeBookUrlsSpecific({size: src.height});
//                 //   const res = await fetch(url, {
//                 //     method: "POST",
//                 //   });
//                 //   const data = await res.blob();
//                 //   // make and click a temporary link to download the Blob
//                 //   const link = document.createElement("a");
//                 //   link.href = URL.createObjectURL(data);
//                 //   link.download = "test.zip";
//                 //   link.click();
//                 //   link.remove();
//                 // }}
//                 onClick={() => {
//                   console.log("click");
//                 }}
//               >
//                 Do it ajax style
//               </button>
//             </li>
//           </ul>
//           <div class="relative" style={{width: `${src.width}px`}}>
//             <video
//               src={src.src}
//               class=""
//               style={{width: "80vw", "max-width": "none"}}
//               controls={true}
//               muted
//               autoplay
//             />
//             <div class="w-full  z-10 absolute border border-dotted top-0 left-0 border-pink-500  aspect-video" />
//           </div>
//         </div>
//       );
//     }}
//   </For>
// </div>
