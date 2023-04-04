import {DotLogo, IconMenu} from "@components/Icons";
import {mobileHorizontalPadding} from "@lib/UI";
type HeaderProps = object;
export function Header(props: HeaderProps) {
  return (
    <header
      class={`${mobileHorizontalPadding} py-2 flex justify-between items-center`}
    >
      {/* <span class="w-16"> */}
      <span class="w-32">
        <DotLogo />
      </span>
      <IconMenu classNames="w-8" />
      {/* </span> */}
    </header>
  );
}
