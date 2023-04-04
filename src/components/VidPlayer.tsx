import type {IVidWithCustom} from "@customTypes/types";
import {mobileHorizontalPadding, CONTAINER} from "@lib/UI";
import {playerLoader, setPlayerLoaderModule} from "@lib/store";
import {For, createEffect, createSignal, onMount} from "solid-js";
import {H1, H2} from "@components/Heading";
import {IconPlay} from "@components/Icons";

// first poster with button that looks like play button
// vid data not loaded until a chapter is picked
// chapter picked => instantiate module
interface IVidPlayerProps {
  vids: Record<string | number | symbol, IVidWithCustom[]>;
  book: null | string;
  chapter: null | string;
  playlist: string | undefined;
}
export function VidPlayer(props: IVidPlayerProps) {
  const firstVid = () => {
    const defaultVid =
      props.vids[String(props.book).toUpperCase()] ||
      props.vids[Object.keys(props.vids)[0]];
    const defaultChap = defaultVid[0];
    const firstBook = props.vids[String(props.book?.toUpperCase())];
    if (!firstBook) return {vids: defaultVid, chap: defaultChap};
    const firstChap =
      firstBook &&
      firstBook.find((vid) => vid.chapNum === Number(props.chapter));
    return firstChap
      ? {vids: firstBook, chap: firstChap}
      : {vids: defaultVid, chap: defaultChap};
  };
  const [currentVid, setCurrentVid] = createSignal(firstVid().chap);
  const [currentBook, setCurrentBook] = createSignal(firstVid().vids);
  const [vjsPlayer, setVjsPlayer] = createSignal();
  let player: HTMLDivElement | undefined;

  function changeVid(chapNum: number | null | undefined) {
    const newVid = currentBook().find((vid) => vid.chapNum == chapNum);
    if (newVid) {
      setCurrentVid(newVid);
    }
  }
  function normalizeBookName(bookname: string) {
    const parts = bookname.split(/(\d+)/).filter((r) => !!r); // Split on any digits
    if (parts.length > 1) {
      const secondPart = upperFirstLowerRest(parts[1]);
      return `${parts[0]} ${secondPart}`;
    } else return upperFirstLowerRest(bookname);
  }
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
  async function changePlayerSrc(vid: IVidWithCustom) {
    if (!vjsPlayer()) return;
    changeVid(vid.chapNum);
    vjsPlayer().src(vid.sources);
    vjsPlayer().poster(vid.poster);
  }
  onMount(async () => {
    if (playerLoader().loaded) {
      const vPlayer = await playerLoader().module({
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
      });
      // set
      setVjsPlayer(vPlayer.ref);
    }
  });

  const transparentOverlay =
    "linear-gradient(0deg, hsla(20, 100%, 56%, 1) 0%, hsla(20, 100%, 56%, 0) 55%, hsla(20, 100%, 56%, 0) 75%, hsla(20, 100%, 56%, 1) 100%);";

  return (
    <div
      class={`grid grid-rows-[auto_auto_1fr] h-full overflow-y-auto overflow-x-hidden ${CONTAINER} sm:(rounded-lg w-full)`}
    >
      {/* <pre>{JSON.stringify(props.vids, null, 2)}</pre> */}
      {/* <div id="playerContainer"></div> */}
      <div class="relative" data-title="vidPoster">
        <div class="relative">
          {/* <img src={currentVid().poster} />
          <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <IconPlay classNames="w-16 text-neutral-200" />
          </span> */}
          <div class="aspect-12/9 sm:aspect-video sm:(rounded-lg overflow-hidden)">
            <div ref={player} />
          </div>
        </div>
      </div>
      <div
        class="overflow-x-auto scrollbar-hide min-h-150px"
        title="chapterNums"
      >
        <ul class="flex flex-nowrap gap-1 items-start content-start py-4 overflow-x-auto scrollbar-hide x-scroll-gradient">
          <For each={currentBook()}>
            {(vid) => {
              return (
                <li>
                  <button
                    onClick={() => {
                      changePlayerSrc(vid);
                    }}
                    class={`rounded-full h-8 w-8 inline-grid place-content-center text-center flex-shrink-0 bg-neutral-400 text-white sm:(w-12 h-12) ${
                      vid.chapNum === currentVid().chapNum
                        ? "bg-neutral-800 transform scale-130 mx-3 transition-colors duration-200"
                        : ""
                    }`}
                  >
                    {vid.chapNum}
                  </button>
                </li>
              );
            }}
          </For>
        </ul>
        <div class={`${mobileHorizontalPadding}`}>
          <H1 classes="font-bold">{normalizeBookName(currentVid().book)}</H1>
          <p>{formatPlayListName(props.playlist)}</p>
        </div>
      </div>
      <div
        title="bookSelection"
        class={`${mobileHorizontalPadding} py-2 bg-primary text-base rounded-tr-xl rounded-tl-xl overflow-y-hidden scrollbar-hide min-h-200px`}
      >
        <H2>Bible Selection</H2>
        <p>Choose a book of the bible to watch here.</p>
        <div class="relative h-full">
          <div
            style={{
              background: transparentOverlay,
              position: "absolute",
              inset: "0",
              "pointer-events": "none",
              height: "100%",
            }}
            class="sm:(hidden)"
          />
          <ul class="h-full overflow-y-auto scrollbar-hide pt-8 pb-36 sm:(max-h-[50vh])">
            <For each={Object.entries(props.vids)}>
              {([key, book], idx) => {
                return (
                  <li class="py-1 w-full border-y border-base md:(text-lg py-2)">
                    <button
                      onClick={() => setNewBook(book)}
                      class="inline-flex gap-2 items-center"
                    >
                      <span class="bg-neutral-100 text-primary rounded-full p-3 h-0 w-0 inline-grid place-content-center">
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
