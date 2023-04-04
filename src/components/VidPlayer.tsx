import type {IVidWithCustom} from "@customTypes/types";
import {mobileHorizontalPadding} from "@lib/UI";
import {playerLoader} from "@lib/store";
import {For, createEffect, createSignal, onMount} from "solid-js";
import {H1, H2} from "@components/Heading";

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
    const defaultVid = props.vids[String(props.book).toUpperCase()];
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
  // props.vids.find((vid) => {
  //   return (
  //     vid.book?.normalize().toUpperCase() ===
  //       props.book?.normalize().toUpperCase() &&
  //     String(vid.chapNum) === props.chapter
  //   );
  // }) || props.vids[0];
  // console.log(firstVid());
  // const firstPoster = () => props.vids.find(vid => vid.book = )
  // createEffect(async () => {

  // });
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
  }
  const transparentOverlay =
    "linear-gradient(0deg, hsla(20, 100%, 56%, 1) 0%, hsla(20, 100%, 56%, 0) 55%, hsla(20, 100%, 56%, 0) 75%, hsla(20, 100%, 56%, 1) 100%);";
  return (
    <div class="grid grid-rows-[auto_auto_1fr] h-full overflow-y-auto overflow-x-hidden ">
      {/* <pre>{JSON.stringify(props.vids, null, 2)}</pre> */}
      {/* <div id="playerContainer"></div> */}
      <div class="relative" title="vidPoster">
        <img src={currentVid().poster} />
      </div>
      <div
        class="overflow-x-auto scrollbar-hide min-h-150px"
        title="chapterNums"
      >
        <ul class="flex flex-nowrap gap-1 items-start content-start py-4 overflow-x-auto scrollbar-hide">
          <For each={currentBook()}>
            {(vid) => {
              return (
                <li>
                  <button
                    onClick={() => {
                      changeVid(vid.chapNum);
                    }}
                    class={`rounded-full h-8 w-8 inline-grid place-content-center text-center flex-shrink-0 bg-neutral-400 text-white  ${
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
          />
          <ul class="h-full overflow-y-auto scrollbar-hide pt-8 pb-36">
            <For each={Object.entries(props.vids)}>
              {([key, book], idx) => {
                return (
                  <li class="py-1 w-full border-y border-base">
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
