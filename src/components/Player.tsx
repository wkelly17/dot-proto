import type {
  IVidWithCustom,
  customVideoSources,
  userPreferencesI,
  wholeBookPresets,
  IpopulateSwPayload,
  i18nDictWithLangCode,
} from "@customTypes/types";
import {For, JSX, Show, createResource, createSignal, onMount} from "solid-js";
import {
  mobileHorizontalPadding,
  CONTAINER,
  debounce,
  setCookie,
  playerCustomHotKeys,
  getJsonFromDocCookie,
} from "@lib/UI";
import {setDownloadPreference} from "@lib/store";
import {
  IconChapBack,
  IconChapNext,
  LoadingSpinner,
  SpeedIcon,
  IconDownload,
} from "@components/Icons";
import {ChapterList} from "@components/PlayerNavigation/ChaptersList";
import {SeekBarChapterText} from "@components/Player/SeekBarText";
import {DownloadMenu} from "@components/PlayerNavigation/DownloadPopover";
import type {VideoJsPlayer} from "video.js";
import {PLAYER_LOADER_OPTIONS} from "src/constants";
import {AppWrapper} from "@components/AppWrapper";
import {useI18n} from "@solid-primitives/i18n";

import {
  cleanUpOldChapters,
  ChapterMarker,
} from "@components/Player/ChapterMarker";

import {
  convertTimeToSeconds,
  bytesToMb,
  normalizeBookName,
  formatPlayListName,
} from "@utils";

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
  userPreferences: userPreferencesI | undefined;
}
export function VidPlayer(props: IVidPlayerProps) {
  const [currentVid, setCurrentVid] = createSignal(props.initialData.chap);
  const [currentBook, setCurrentBook] = createSignal(props.initialData.vids);
  const [currentChapLabel, setCurrentChapLabel] = createSignal("");
  const [vjsPlayer, setVjsPlayer] = createSignal<VideoJsPlayer>();
  const [showDownloadMenu, setShowDownloadMenu] = createSignal(false);
  const [playerSpeed, setPlayerSpeed] = createSignal(
    props.userPreferences?.playbackSpeed || "1"
  );
  const [t, {add, locale, dict}] = useI18n();
  // console.log(props.useI18n);
  // const [t, {locale, setLocale, getDictionary}] = props.useI18n();
  // console.log(t.hello({name: name()}));
  let playerRef: HTMLDivElement | undefined;
  let formDataRef: HTMLFormElement | undefined;
  const formName = "downloadData";

  //=============== state setters / derived  =============
  function changeVid(chapNum: string | null | undefined) {
    if (!chapNum) return;
    const newVid = currentBook().find((vid) => vid.chapter == chapNum);
    if (newVid) {
      setCurrentVid(newVid);
    }
  }
  function changePlayerSrc(vid: IVidWithCustom) {
    if (!vjsPlayer()) return;

    changeVid(vid.chapter);
    vid.sources && vjsPlayer()?.src(vid.sources);
    vid.poster && vjsPlayer()?.poster(vid.poster);
    vjsPlayer()?.load();
    vjsPlayer()?.one("loadedmetadata", (e) => {
      getChaptersArrFromVtt(vid);
    });
  }
  // todo: break apart
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
      if (!candidates.length) return;
      const prevStart = candidates.reduce((acc, current) => {
        return acc.chapterEnd > current.chapterEnd ? acc : current;
      });
      if (prevStart) {
        vjsPlayer()?.currentTime(prevStart.chapterStart);
      }
    }
  }
  function setNewBook(vids: IVidWithCustom[]) {
    setCurrentBook(vids);
    const firstBook = vids[0];
    setCurrentVid(firstBook);
    changePlayerSrc(firstBook);
  }

  // type wholeBookUrlsSpecificParams = {
  //   preset: wholeBookPresets;
  // };
  const getAllMp4sForBook = (preset: wholeBookPresets) => {
    if (!currentBook()) return;

    // {name:"higher quality", [srcs]}
    const mp4SrcObjects = currentBook().reduce(
      (acc: customVideoSources[], curr) => {
        const mp4s = curr.sources?.filter(
          (src) => src.container === "MP4" && src.src.includes("https")
        );
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
  const wholeBooksOptionsForSelect = () => {
    // if (!currentBook()) return;
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

    const result: {
      size: string;
      totalSize: number;
      wholeBooksOptionsForSelectId: wholeBookPresets;
    }[] = [
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
      (source) => source.container === "MP4" && source.src?.includes("https")
    );
    // todo: i think http vs https was the duplicates.  See if this is needed now
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
  // todo: revise
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

  function populateSwPayload({type, val}: IpopulateSwPayload) {
    if (type === "VID") {
      const matching = currentMp4Sources().find(
        (source) => String(source.size) === val
      );
      setDownloadPreference((prev) => {
        return {
          ...prev,
          swPayload: [matching],
        };
      });
    } else if (type === "BOOK") {
      const videoSources = getAllMp4sForBook(val);
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
  onMount(async () => {
    // setCookie(
    //   "user",
    //   JSON.stringify({
    //     useSavedVid: true,
    //   })
    // );
    // Todo: replace the state when moving beyond each chapter chunk?
    // setTimeout(() => {
    //   history.pushState(null, "", `${location.href}?q=t`);
    // }, 5000);
    const playerModule = await import("@brightcove/player-loader");

    const options = {
      ...PLAYER_LOADER_OPTIONS,
      refNode: playerRef,
      videoId: currentVid().id,
    };

    const vPlayer = await playerModule.default(options);

    // set state for later
    setVjsPlayer(vPlayer.ref);
    //  inline
    vPlayer.ref.playsinline(true);
    // add hotkeys
    vPlayer.ref.on("keydown", (e: KeyboardEvent) =>
      playerCustomHotKeys(e, vPlayer.ref)
    );
    // get chapters for first video if exist
    vPlayer.ref.one("loadedmetadata", () => {
      getChaptersArrFromVtt(currentVid());
      // Adjust speed if present in cookie
      if (props.userPreferences?.playbackSpeed) {
        vjsPlayer()?.playbackRate(Number(props.userPreferences?.playbackSpeed));
      }
    });
    // Add in Chapters text to the tool tip that shows up when you hover
    const seekBar = vPlayer.ref.controlBar.progressControl.seekBar;
    const currentToolTip = document.querySelector(
      ".vjs-progress-control .vjs-mouse-display"
    ) as Element;
    const seekBarEl = (
      <SeekBarChapterText text={currentChapLabel()} />
    ) as Node;
    currentToolTip.appendChild(seekBarEl);
    //handle the actual hovering to update the chapter spot
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
  //=============== state setters / derived  =============

  // return <p>Still fast here? x? y? z? a? b? c? d? e? f?</p>;
  return (
    <div class={`overflow-x-hidden ${CONTAINER} w-full sm:(rounded-lg)`}>
      <div
        data-title="VideoPlayer"
        class="w-full mx-auto aspect-12/9 sm:aspect-video   sm:(rounded-lg overflow-hidden)"
      >
        <div
          ref={playerRef}
          id="PLAYER"
          class="w-full h-full grid place-content-center"
        >
          <LoadingSpinner classNames="w-16 h-16 text-primary" />
        </div>
      </div>

      <div data-title="VideoSupplmental" class="py-2">
        <div data-title="videoControl" class="flex gap-2">
          {/* Chapter Back */}
          <button
            data-title="chapNext"
            class="text-surface w-4 hover:text-primary"
            onClick={() => {
              jumpToNextChap("PREV");
            }}
          >
            <IconChapBack />
          </button>
          {/* Chapter Forward */}

          <button
            data-title="chapBack"
            class="text-surface w-4 hover:text-primary"
            onClick={() => jumpToNextChap("NEXT")}
          >
            <IconChapNext />
          </button>
          <span class="inline-flex gap-1 items-center">
            <input
              type="range"
              class="speedRange appearance-none bg-transparent cursor-pointer w-60 "
              min=".25"
              max="5"
              step=".25"
              value={props.userPreferences?.playbackSpeed || "1"}
              onInput={(e) => {
                setPlayerSpeed(e.target.value);
              }}
              onChange={(e) => {
                vjsPlayer()?.playbackRate(Number(e.target.value));
                const currCookie = getJsonFromDocCookie() || {};
                (currCookie.playbackSpeed = String(e.target.value)),
                  setCookie(JSON.stringify(currCookie));
              }}
            />
            <span class="inline-block h-5 w-5">
              <SpeedIcon />
            </span>
            <span class="inline-block ml-2">{playerSpeed()}</span>
          </span>
          {/* Speed Preference */}
          <div data-title="openDownloadSetting" class="relative ml-auto">
            <button
              class=""
              onClick={() => setShowDownloadMenu(!showDownloadMenu())}
            >
              <IconDownload />
            </button>
            <div class="absolute right-0 z-10 p-2 pb-12 dark:bg-neutral-900 bg-neutral-100 ">
              <Show when={showDownloadMenu()}>
                <DownloadMenu
                  formDataRef={formDataRef}
                  formName={formName}
                  currentMp4Sources={currentMp4Sources}
                  populateSwPayload={populateSwPayload}
                  wholeBooksOptionsForSelect={wholeBooksOptionsForSelect}
                />
              </Show>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto scrollbar-hide" data-title="ChaptersNav">
          <ChapterList
            videos={currentBook()}
            formDataRef={formDataRef}
            chapterButtonOnClick={(vid: IVidWithCustom) => {
              console.log({formDataRef});
              formDataRef && formDataRef.reset();
              changePlayerSrc(vid);
            }}
            currentVid={currentVid()}
          />
        </div>
        <div
          data-title="BookAndPlaylistName"
          class={`${mobileHorizontalPadding} sm:(py-4)`}
        >
          <h1 class="font-bold"> {normalizeBookName(currentVid().book)}</h1>
          <p>{formatPlayListName(props.playlist)}</p>
        </div>
      </div>
      <div
        data-title="BookNav"
        class={`${mobileHorizontalPadding} py-2 bg-primary dark:bg-surface/05 text-base rounded-tr-xl rounded-tl-xl overflow-y-hidden scrollbar-hide min-h-200px md:h-max`}
      >
        <h2 class="text-neutral-100 dark:text-neutral-200">Bible Selection</h2>
        <p class="text-neutral-100 dark:text-neutral-200">
          Choose a book of the bible to watch here.
        </p>
        <div class="relative h-full sm:h-auto ">
          <div
            style={{
              position: "absolute",
              inset: "0",
              "pointer-events": "none",
              height: "100%",
            }}
            class="y-scroll-gradient sm:(hidden)"
          />
          <ul class="h-full overflow-y-auto scrollbar-hide pt-8 pb-36 sm:(max-h-[50vh]) list-none">
            <For each={Object.entries(props.vids)}>
              {([key, book], idx) => {
                return (
                  <li class="text-neutral-100 dark:text-neutral-200 py-1 w-full border-y border-base md:text-lg md:py-2">
                    <button
                      onClick={() => {
                        formDataRef && formDataRef.reset();
                        setNewBook(book);
                      }}
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
  );
}
