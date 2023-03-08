import {onMount} from "solid-js";
import {setPlayerLoaderModule} from "../store";

export function PlayerModuleImporter(props: any) {
  onMount(async () => {
    import("@brightcove/player-loader").then((val) => {
      setPlayerLoaderModule({
        loaded: true,
        module: val.default,
      });
    });
  });
  return <>{props.children}</>;
}
