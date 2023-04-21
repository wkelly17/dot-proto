import type {AnyAsyncFunction, AnyFunction} from "@customTypes/types";
import {createChainedI18n} from "@solid-primitives/i18n";
import {createSignal, createMemo} from "solid-js";
import type {VideoJsPlayer} from "video.js";

type IdownloadPreferences = {
  saveToServiceWorker: boolean;
  downloadOffline: boolean;
  justThisVideo: boolean;
  swPayload: object | null | undefined;
};
const [downloadPreference, setDownloadPreference] =
  createSignal<IdownloadPreferences>({
    saveToServiceWorker: false,
    downloadOffline: true,
    justThisVideo: true,
    swPayload:
      null /* arr of vid {name, refid, src, size} objects that sw can digest */,
  });

const [playerLoader, setPlayerLoaderModule] = createSignal<{
  loaded: boolean;
  module: AnyAsyncFunction<
    any,
    {
      type: string;
      ref: VideoJsPlayer;
    }
  > | null;
}>({
  loaded: false,
  module: null,
});

export {
  setPlayerLoaderModule,
  playerLoader,
  downloadPreference,
  setDownloadPreference,
};
