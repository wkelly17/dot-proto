import {createVisibilityObserver} from "@solid-primitives/intersection-observer";
import {Show} from "solid-js";
import {createSignal, createEffect} from "solid-js";
import {playerLoader} from "../store";

export function Vid2(props: any) {
  const options = {
    responsive: true,
    // fluid: true,
    aspectRation: "1:1",
    fill: true,
    controls: true,
    playbackRates: [0.5, 1, 1.5, 2, 2.5],
    preload: "auto",
    // html5: {
    //   vhs: {
    //     // GOAL_BUFFER_LENGTH: 50,
    //     experimentalBufferBasedABR: true,
    //   },
    // },
  };
  let el: HTMLDivElement | undefined;
  let player: HTMLDivElement | undefined;
  const [hasInstantiatedPlayer, setHasInstantiatedPlayer] = createSignal(false);

  const useVisibilityObserver = createVisibilityObserver(
    {threshold: 0.8},
    (entry) => {
      console.log({entry});
      // do some calculations on the intersection entry
      return entry.isIntersecting;
    }
  );

  // make sure that you pass the element reference in a thunk if it is undefined initially
  const visible = useVisibilityObserver(() => el);
  createEffect(async () => {
    if (visible() && playerLoader().loaded && !hasInstantiatedPlayer()) {
      console.log("PLAYER LOADER IS AVAILABLE. setting it locally");
      setHasInstantiatedPlayer(true);
      // debugger;
      const pref = await playerLoader().module({
        refNode: player,
        refNodeInsert: "replace",
        accountId: 6314154063001,
        playerId: "9mlrvmAybr",
        controls: true,
        // embedType: "iframe",
        embedType: "in-page",
        options,
        // playlistId: "ref:benin-new-testament",
        // id: 6312743832112,
        videoId: `ref:${props.vid.reference_id}`,
        embedOptions: {
          // playlist: true,
          responsive: {
            aspectRatio: "1:1",
          },
        },

        //   // playlistId: "ref:1745043212224883810",
      });
      // pref.ref.fill(true);
      pref.ref.aspectRatio("1:1");
    }
  });
  return (
    <div class="aspect-square w-full" ref={el}>
      <div ref={player} />
      <Show when={visible()}>{props.vid.name}</Show>
    </div>
  );
}
