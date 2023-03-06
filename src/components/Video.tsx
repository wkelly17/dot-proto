import {onMount, createEffect, createSignal, Show} from "solid-js";
// import videojs from "video.js";
import {
  setPlayerSrc,
  playerSrc,
  player,
  setPlayer,
  setAllVideos,
} from "../store";

// import videojsPlaylistPlugin from "videojs-playlist";
import {getMp4DownloadSize} from "../utils";

export function VideoPlayer(props: any) {
  let videoRef: any;
  const [mp4Src, setMp4Src] = createSignal("");

  const sources = props.videos.map((vid) => {
    return {
      sources: vid.sources,
      poster: vid.poster,
      slug: vid.slugName,
      size: vid.sources.filter(
        (src) => src.container && src.container == "MP4"
      )[0].size,
    };
  });
  // onMount(async () => {
  //   // get the ZIP stream in a Blob
  //   // const resp = await fetch(tempUrl);
  //   // const resp2 = await fetch(thing2);
  //   // const blob = await downloadZip([resp, resp2]).blob();
  //   // console.log("FETCHING FROM SW!");
  //   // const resp = await fetch("/test.zip");
  //   // console.log({resp});
  //   // // // make and click a temporary link to download the Blob
  //   // const link = document.createElement("a");
  //   // link.href = URL.createObjectURL(blob);
  //   // link.download = "test.zip";
  //   // link.click();
  //   // link.remove();
  // });
  // onMount(() => {
  //   let el = document.querySelector("#vid1");

  //   if (el) {
  //     videojs(el);
  //   }
  // });
  // createEffect(async () => {
  //   // if (!playerSrc()) return;
  //   // let el = document.querySelector("#videoPlayerDiv");
  //   let el = document.querySelector("#videoPlayer");
  //   if (!el && !player()) return;
  //   if (!player()) {
  //     const options = {
  //       responsive: true,
  //       fluid: true,
  //       controls: true,
  //       playbackRates: [0.5, 1, 1.5, 2, 2.5, 3],
  //     };
  //     // const playerInstance = await brightcovePlayerLoader({
  //     //   refNode: el,
  //     //   refNodeInsert: "append",
  //     //   accountId: props.accountId,
  //     //   playerId: "9mlrvmAybr",
  //     //   controls: true,
  //     //   // embedType: "iframe",
  //     //   options
  //     //   // playlistId: "ref:benin-new-testament",
  //     //   // embedOptions: {
  //     //   //   playlist: true,
  //     //   //   responsive: true,
  //     //   // },

  //     //   // playlistId: "ref:1745043212224883810",
  //     // });
  //     const playerInstance = videojs(el, options);
  //     videojs.registerPlugin("playlist", videojsPlaylistPlugin);
  //     playerInstance.playlist(sources);
  //     // playerInstance.ref.on("pause", () => {
  //     //   console.log("PUASE");
  //     // });
  //     setPlayer(playerInstance);
  //     const mp4 = sources[0].sources?.find((src) => {
  //       return src && src.container == "MP4";
  //     });
  //     // 2test.zip?src=${href}&names=${namesHref}&size=${size}
  //     const encoded = `2test.zip?src=${encodeURIComponent(
  //       JSON.stringify([mp4.src])
  //     )}&names=${encodeURIComponent(JSON.stringify([sources[0].slug]))}&size=${
  //       sources[0].size
  //     }`;
  //     setMp4Src(encoded);
  //     // playerInstance.ref.playlist(sources);
  //     // playerInstance.ref.on("pause", () => {
  //     //   console.log("PUASE");
  //     // });
  //   } else {
  //     let currentPlayer: any = player();
  //     if (!playerSrc() && playerSrc() != 0) return;
  //     if (!currentPlayer?.paused) {
  //       currentPlayer.pause();
  //     }

  //     const newSrc = playerSrc();
  //     console.log({newSrc});
  //     currentPlayer?.playlist.currentItem(newSrc);
  //     console.log(currentPlayer.currentSrc());
  //     console.log(currentPlayer.currentType());
  //     const corresponding = sources[newSrc];
  //     console.log({corresponding});
  //     const mp4 = corresponding.sources?.find((src) => {
  //       return src && src.container == "MP4";
  //     });
  //     // debugger;
  //     const encoded = `2test.zip?src=${encodeURIComponent(
  //       JSON.stringify([mp4.src])
  //     )}&names=${corresponding.slug}&size=${corresponding.size}`;
  //     setMp4Src(encoded);

  //     // currentPlayer.load();
  //     //  currentPlayer.play();
  //     // }
  //     // const thePlayer = player();
  //     // player.src = playerSrc()?.src;
  //     // player.on("ready", function () {
  //     //   debugger;
  //     //   player.src = playerSrc()?.src;
  //     // });
  //   }
  // });

  return (
    // <div data-vjs-player class="">
    <>
      {/* <p>Source is {playerSrc()?.src} </p> */}
      <p>Play list page</p>
      <div
        class={` mx-auto relative video-js w-full aspect-video`}
        id="videoPlayerDiv"
      >
        <video class="video-js" id="videoPlayer" src=""></video>
      </div>
      <Show when={mp4Src()}>
        <form method="post" action={mp4Src()}>
          <button>Download this video</button>
        </form>
      </Show>
    </>
    // </div>
  );
}
