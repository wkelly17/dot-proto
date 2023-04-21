import {JSX, mergeProps} from "solid-js";

interface IconProps {
  classNames?: string;
}
interface IDotLogo extends IconProps {
  fillColor?: "string";
  dotOne?: "string";
  dotTwo?: "string";
  dotThree?: "string";
}
export function DotLogo(props: IDotLogo) {
  const defaultProps = {
    fillColor: "fill-surface",
    dotOne: "fill-primary",
    dotTwo: "fill-secondary",
    dotThree: "fill-tertiary",
  };
  const mergedProps = mergeProps(defaultProps, props);

  return (
    <svg
      class=""
      viewBox="0 0 102 30"
      xml-space="preserve"
      xmlns="http://www.w3.org/2000/svg"
      fill="black"
    >
      <path
        class={mergedProps.fillColor}
        d="M0 0h-4.555c-3.314.003-6.628.054-9.942.001-5.839-.095-11.255-5.606-11.261-11.4-.004-4.35.032-8.7-.011-13.05-.02-2.071.476-3.965 1.599-5.688 2.521-3.868 6.133-6.12 10.712-6.015 6.267.144 11.945 5.912 11.93 12.56-.011 5.109-.011 10.219-.073 15.328-.027 2.235.155 4.394 1.185 6.433C-.163-1.33-.152-.706 0 0m52.84-7.983c.286-.483.401-.821.629-1.041 3.173-3.071 6.38-6.107 9.543-9.188 4.435-4.319 10.755-4.879 15.389-.847 3.896 3.391 7.536 7.124 10.951 11.003 2.07 2.352 3.128 5.392 2.41 8.682-.684 3.129-2.189 5.836-4.763 7.794-3.062 2.329-6.447 3.28-10.311 2.213-2.704-.746-4.852-2.276-6.784-4.193A2560.187 2560.187 0 0 1 59.35-4.109c-1.585-1.593-3.336-2.892-5.583-3.393-.251-.056-.473-.241-.927-.481m-78.508 40.197c.362-.03.716-.147 1.023-.071 3.702.921 7.443 1.375 11.266 1.171 1.471-.078 1.685.243 1.683 1.894-.023 16.712-.045 33.424-.079 50.136-.001.755.003 1.54-.19 2.258-1.846 6.845-10.137 11.937-17.426 5.644a17 17 0 0 1-1.612-1.609c-.919-1.04-.901-1.285.03-2.23 3.458-3.507 5.269-7.722 5.256-12.648-.04-14.568-.127-29.136-.184-43.704-.001-.259.14-.518.233-.841m-20.781-11.843c.854.476 1.339.613 1.632.929 2.772 2.982 6.132 5.223 9.739 6.925 2.487 1.174 3.261 2.497 3.222 5.281-.197 14.022-.089 28.048-.12 42.072a21.25 21.25 0 0 1-.381 3.905c-1.063 5.592-7.334 9.416-12.769 7.939-3.131-.851-5.373-2.692-6.931-5.485-1.154-2.067-1.104-2.279.561-3.842 3.618-3.395 5.334-7.636 5.397-12.565.019-1.45-.055-2.9-.056-4.35-.01-12.228-.007-24.457-.03-36.685-.002-1.211-.151-2.421-.264-4.124M70.905-54.8c-.91.069-1.245.131-1.577.115a30.368 30.368 0 0 0-13.334 2.323c-1.169.486-1.887.233-2.719-.622-3.562-3.657-7.176-7.264-10.781-10.879-7.064-7.085-14.136-14.161-21.203-21.243-1.686-1.69-3.07-3.603-3.437-6.003-.678-4.447.951-8.04 4.564-10.613 3.579-2.55 7.015-2.717 10.692-.759.843.448 1.188.989 1.043 1.98-.47 3.19.282 6.23 1.783 8.977 1.007 1.845 2.41 3.545 3.906 5.039 9.957 9.944 19.991 19.81 29.976 29.726.422.419.609 1.077 1.087 1.959m-22.521 5.695c-.28.267-.442.503-.667.621a31.96 31.96 0 0 0-9.191 7.285c-.953 1.09-1.229 1.051-2.313-.041C29.506-48 22.807-54.768 16.089-61.517A4481.231 4481.231 0 0 0 1.297-76.298c-1.902-1.894-3.345-4.048-3.754-6.744-1.118-7.353 6.01-12.832 11.422-12.172 2.38.291 2.64.348 2.709 2.641.135 4.475 1.695 8.345 4.847 11.533 1.648 1.666 3.389 3.24 5.05 4.894 8.657 8.618 17.303 17.247 25.944 25.881.322.322.554.734.869 1.16M-51.76-.482l-.64.078c.046 1.058.126 2.115.134 3.172.044 5.867.102 11.735.095 17.602-.013 10.357-.073 20.714-.104 31.072-.013 4.627.084 9.257-.052 13.881-.048 1.613-.37 3.34-1.048 4.79-2.089 4.472-7.164 6.924-11.667 5.887-5.093-1.172-8.51-5.377-8.521-10.58-.021-10.084.001-20.167-.011-30.251-.026-22.378-.093-44.756-.052-67.134.005-2.811.379-5.653.891-8.423 1.286-6.952 4.087-13.3 8.143-19.087 5.576-7.957 12.904-13.757 21.831-17.52 6.445-2.717 13.182-3.911 20.19-3.765 4.601.097 9.036.932 13.406 2.298 1.271.397 2.095 1.194 2.811 2.275.834 1.257 1.708 2.527 2.767 3.59a6085.926 6085.926 0 0 0 25.811 25.759c1.174 1.166 1.985 2.488 2.208 4.115.524 3.824.951 7.662 1.513 11.48.239 1.618-.32 2.764-1.446 3.857-2.627 2.548-5.165 5.187-7.765 7.764-5.07 5.023-6.507 14.164-2.065 20.585.313.452.455 1.023.734 1.673-2.325.462-3.964-.48-5.525-1.455C6.365-1.014 4.347-4.11 4.375-8.388c.035-5.18.009-10.361.021-15.541.026-11.141-9.748-19.699-20.754-18.064-8.715 1.295-15.107 8.052-15.575 16.786-.144 2.682-.072 5.376-.068 8.065.003 2.344-.147 4.71.113 7.028.767 6.859 4.985 13.023 12.411 15.308 2.814.866 5.682.937 8.595.916 9.043-.064 18.088.019 27.131-.091 2.231-.027 4.199.488 6.123 1.492 4.024 2.1 6.476 7.11 5.505 11.311-1.135 4.916-5.788 8.628-10.846 8.629-10.773.001-21.547-.008-32.321-.017-.551-.001-1.108-.006-1.653-.076-6.581-.846-12.837-2.632-18.385-6.431-7.073-4.845-12.489-11.017-15.397-19.208-.27-.76-.686-1.469-1.035-2.201M90.208-44.087l.364-.432c-1.316-1.292-2.644-2.572-3.945-3.88C75.426-59.66 64.23-70.928 53.032-82.193c-3.263-3.281-6.562-6.526-9.781-9.85-4.004-4.136-4.04-9.023-.823-13.53 2.443-3.423 7.349-5.017 11.374-3.796 2.117.641 3.802 1.898 5.336 3.433 9.423 9.427 18.845 18.855 28.284 28.265 13.106 13.068 26.254 26.093 39.329 39.192 5.742 5.752 9.993 12.466 12.425 20.278 2.031 6.523 3.029 13.128 2.175 19.987-.55 4.414-1.481 8.717-3.133 12.823-3.331 8.281-8.328 15.357-15.413 20.92-5.848 4.592-12.333 7.81-19.552 9.541-5.417 1.298-10.907 1.593-16.45 1.057a46.903 46.903 0 0 1-12.832-3.077c-6.964-2.761-13.026-6.865-18.265-12.243-5.012-5.144-10.143-10.172-15.223-15.25-2.208-2.207-3.444-4.883-3.304-7.99.199-4.418 2.625-7.514 6.509-9.354 3.958-1.875 7.749-1.186 10.928 1.756 3.698 3.421 7.323 6.937 10.77 10.609 4.594 4.894 10.113 6.986 16.739 6.226 4.662-.535 8.526-2.573 11.554-6.198 5.756-6.89 5.609-17.886-1.073-24.562-2.833-2.831-5.657-5.672-8.504-8.489-2.203-2.178-4.789-3.906-7.778-4.557-6.963-1.514-13.275-.264-18.484 5.035-6.439 6.55-12.958 13.022-19.455 19.515-1.024 1.024-2.028 2.099-3.188 2.95-3.447 2.531-7.229 3.205-11.062 1.084-4.032-2.232-6.366-5.654-6.052-10.478.17-2.621 1.501-4.688 3.305-6.495 7.565-7.574 15.087-15.191 22.726-22.689 1.857-1.822 3.996-3.416 6.19-4.826 8.243-5.298 17.318-7.031 26.947-5.651 4.097.587 8.113 1.683 11.693 3.945.38.24.84.353 1.264.525M-8.723-84.715c-.77-.162-1.178-.212-1.564-.334-3.993-1.26-8.098-1.604-12.262-1.633-4.567-.032-9.096.133-13.577 1.169-6.309 1.458-12.224 3.76-17.705 7.271-11.462 7.341-19.137 17.559-23.356 30.409-1.183 3.601-2.006 7.314-2.078 11.156-.063 3.306-.348 6.61-.352 9.915-.039 30.047-.039 60.094-.047 90.142-.001 1.918-.219 3.818.214 5.751 1.569 6.997 6.018 11.204 12.744 13.002 1.94.518 4.128.295 6.182.136 1.473-.114 1.829.185 2.306 1.384 3.007 7.561 10.916 11.752 18.801 9.94 1.363-.313 2.155-.045 2.947 1.102 3.11 4.502 7.322 7.251 12.874 7.675 3.546.271 6.877-.554 9.896-2.386 4.223-2.564 6.831-6.352 7.939-11.159.153-.663.178-1.368.177-2.053-.009-7.944-.018-15.887-.06-23.831-.049-9.176-.131-18.352-.2-27.528-.014-1.838.289-2.122 2.167-2.111 7.316.042 14.634.203 21.946.073 6.576-.117 11.102-3.686 14.09-9.325.825-1.558 1.651-3.213 1.262-5.129-.042-.208.197-.474.385-.887.465.32.88.523 1.188.832 6.434 6.453 12.709 13.073 19.323 19.335 5.73 5.426 12.562 9.136 20.123 11.551 10.912 3.485 21.859 3.633 32.83.559 8.724-2.444 16.35-6.876 22.913-13.181 6.871-6.6 11.846-14.368 14.642-23.454.969-3.149 1.579-6.443 1.993-9.716.423-3.338.719-6.752.505-10.096-.36-5.651-1.332-11.243-3.396-16.569-2.415-6.229-5.677-11.983-10.102-17.004-2.326-2.639-4.86-5.096-7.347-7.589a51383.997 51383.997 0 0 0-49.491-49.556 1288.346 1288.346 0 0 0-14.757-14.538c-6.151-5.955-16.253-6.191-22.686-.545-.973.854-1.731 1.958-2.556 2.974-1.017 1.252-1.169 1.297-2.544.502-2.126-1.229-4.519-1.32-6.83-1.252-6.019.177-10.697 2.873-13.879 8.042-.444.72-.788 1.442-1.907 1.068-3.805-1.271-7.498-.664-11.062.913-4.892 2.163-7.776 6.043-9.129 11.117-.312 1.169-.358 2.41-.56 3.858"
        transform="matrix(.11704 0 0 -.11704 9.33 11.988)"
      />
      <path
        class={mergedProps.fillColor}
        d="M0 0c30.343 0 49.988 18.478 49.988 46.681 0 28.203-19.645 46.681-49.988 46.681h-33.065V0Zm-58.351 114.757H1.167c44.153 0 74.301-27.231 74.301-68.076 0-40.846-30.148-68.077-74.301-68.077h-59.518z"
        transform="matrix(.11704 0 0 -.11704 41.888 18.476)"
      />
      <path
        class={mergedProps.dotOne}
        d="M0 0c0 9.726 7.196 16.144 15.949 16.144S31.898 9.726 31.898 0c0-9.336-7.196-16.144-15.949-16.144S0-9.336 0 0"
        transform="matrix(.11704 0 0 -.11704 52.177 19.25)"
      />
      <path
        class={mergedProps.fillColor}
        d="M0 0c0 27.814-20.423 47.848-47.849 47.848-27.424 0-47.847-20.034-47.847-47.848 0-27.813 20.423-47.848 47.847-47.848C-20.423-47.848 0-27.813 0 0m-121.176 0c0 40.262 31.12 70.021 73.327 70.021 42.208 0 73.328-29.564 73.328-70.021s-31.12-70.021-73.328-70.021c-42.207 0-73.327 29.759-73.327 70.021"
        transform="matrix(.11704 0 0 -.11704 71.55 13.013)"
      />
      <path
        class={mergedProps.dotTwo}
        d="M0 0c0 9.726 7.196 16.144 15.949 16.144S31.898 9.726 31.898 0c0-9.336-7.196-16.144-15.949-16.144S0-9.336 0 0"
        transform="matrix(.11704 0 0 -.11704 75.99 19.25)"
      />
      <path
        class={mergedProps.fillColor}
        d="M0 0h-45.125v21.396H70.41V0H25.285v-114.757H0Z"
        transform="matrix(.11704 0 0 -.11704 85.277 7.549)"
      />
      <path
        class={mergedProps.dotThree}
        d="M0 0c0 9.726 7.196 16.144 15.949 16.144S31.898 9.726 31.898 0c0-9.336-7.196-16.144-15.949-16.144S0-9.336 0 0"
        transform="matrix(.11704 0 0 -.11704 93.79 19.25)"
      />
    </svg>
  );
}
export function DotLogoHandsOnly(props: any) {
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1080"
    height="1080"
    viewBox="5.07 5.07 1080 1080"
    xml-space="preserve"
  >
    <g transform="matrix(1.35 0 0 -1.35 540 540)" clip-path="url(#a)">
      <clipPath id="a">
        <path
          transform="translate(-656.26 -541.37)"
          d="M0 1080h1920V0H0Z"
          stroke-linecap="round"
        />
      </clipPath>
      <path
        style="stroke:none;stroke-width:1;stroke-dasharray:none;stroke-linecap:butt;stroke-dashoffset:0;stroke-linejoin:miter;stroke-miterlimit:4;fill:#981414;fill-rule:nonzero;opacity:1"
        vector-effect="non-scaling-stroke"
        transform="translate(-33.94 6.8)"
        d="M0 0h-4.555c-3.314.003-6.628.054-9.942.001-5.839-.095-11.255-5.606-11.261-11.4-.004-4.35.032-8.7-.011-13.05-.02-2.071.476-3.965 1.599-5.688 2.521-3.868 6.133-6.12 10.712-6.015 6.267.144 11.945 5.912 11.93 12.56-.011 5.109-.011 10.219-.073 15.328-.027 2.235.155 4.394 1.185 6.433C-.163-1.33-.152-.706 0 0m52.84-7.983c.286-.483.401-.821.629-1.041 3.173-3.071 6.38-6.107 9.543-9.188 4.435-4.319 10.755-4.879 15.389-.847 3.896 3.391 7.536 7.124 10.951 11.003 2.07 2.352 3.128 5.392 2.41 8.682-.684 3.129-2.189 5.836-4.763 7.794-3.062 2.329-6.447 3.28-10.311 2.213-2.704-.746-4.852-2.276-6.784-4.193A2560.187 2560.187 0 0 1 59.35-4.109c-1.585-1.593-3.336-2.892-5.583-3.393-.251-.056-.473-.241-.927-.481m-78.508 40.197c.362-.03.716-.147 1.023-.071 3.702.921 7.443 1.375 11.266 1.171 1.471-.078 1.685.243 1.683 1.894-.023 16.712-.045 33.424-.079 50.136-.001.755.003 1.54-.19 2.258-1.846 6.845-10.137 11.937-17.426 5.644a17 17 0 0 1-1.612-1.609c-.919-1.04-.901-1.285.03-2.23 3.458-3.507 5.269-7.722 5.256-12.648-.04-14.568-.127-29.136-.184-43.704-.001-.259.14-.518.233-.841m-20.781-11.843c.854.476 1.339.613 1.632.929 2.772 2.982 6.132 5.223 9.739 6.925 2.487 1.174 3.261 2.497 3.222 5.281-.197 14.022-.089 28.048-.12 42.072a21.25 21.25 0 0 1-.381 3.905c-1.063 5.592-7.334 9.416-12.769 7.939-3.131-.851-5.373-2.692-6.931-5.485-1.154-2.067-1.104-2.279.561-3.842 3.618-3.395 5.334-7.636 5.397-12.565.019-1.45-.055-2.9-.056-4.35-.01-12.228-.007-24.457-.03-36.685-.002-1.211-.151-2.421-.264-4.124M70.905-54.8c-.91.069-1.245.131-1.577.115a30.368 30.368 0 0 0-13.334 2.323c-1.169.486-1.887.233-2.719-.622-3.562-3.657-7.176-7.264-10.781-10.879-7.064-7.085-14.136-14.161-21.203-21.243-1.686-1.69-3.07-3.603-3.437-6.003-.678-4.447.951-8.04 4.564-10.613 3.579-2.55 7.015-2.717 10.692-.759.843.448 1.188.989 1.043 1.98-.47 3.19.282 6.23 1.783 8.977 1.007 1.845 2.41 3.545 3.906 5.039 9.957 9.944 19.991 19.81 29.976 29.726.422.419.609 1.077 1.087 1.959m-22.521 5.695c-.28.267-.442.503-.667.621a31.96 31.96 0 0 0-9.191 7.285c-.953 1.09-1.229 1.051-2.313-.041C29.506-48 22.807-54.768 16.089-61.517A4481.231 4481.231 0 0 0 1.297-76.298c-1.902-1.894-3.345-4.048-3.754-6.744-1.118-7.353 6.01-12.832 11.422-12.172 2.38.291 2.64.348 2.709 2.641.135 4.475 1.695 8.345 4.847 11.533 1.648 1.666 3.389 3.24 5.05 4.894 8.657 8.618 17.303 17.247 25.944 25.881.322.322.554.734.869 1.16M-51.76-.482l-.64.078c.046 1.058.126 2.115.134 3.172.044 5.867.102 11.735.095 17.602-.013 10.357-.073 20.714-.104 31.072-.013 4.627.084 9.257-.052 13.881-.048 1.613-.37 3.34-1.048 4.79-2.089 4.472-7.164 6.924-11.667 5.887-5.093-1.172-8.51-5.377-8.521-10.58-.021-10.084.001-20.167-.011-30.251-.026-22.378-.093-44.756-.052-67.134.005-2.811.379-5.653.891-8.423 1.286-6.952 4.087-13.3 8.143-19.087 5.576-7.957 12.904-13.757 21.831-17.52 6.445-2.717 13.182-3.911 20.19-3.765 4.601.097 9.036.932 13.406 2.298 1.271.397 2.095 1.194 2.811 2.275.834 1.257 1.708 2.527 2.767 3.59a6085.926 6085.926 0 0 0 25.811 25.759c1.174 1.166 1.985 2.488 2.208 4.115.524 3.824.951 7.662 1.513 11.48.239 1.618-.32 2.764-1.446 3.857-2.627 2.548-5.165 5.187-7.765 7.764-5.07 5.023-6.507 14.164-2.065 20.585.313.452.455 1.023.734 1.673-2.325.462-3.964-.48-5.525-1.455C6.365-1.014 4.347-4.11 4.375-8.388c.035-5.18.009-10.361.021-15.541.026-11.141-9.748-19.699-20.754-18.064-8.715 1.295-15.107 8.052-15.575 16.786-.144 2.682-.072 5.376-.068 8.065.003 2.344-.147 4.71.113 7.028.767 6.859 4.985 13.023 12.411 15.308 2.814.866 5.682.937 8.595.916 9.043-.064 18.088.019 27.131-.091 2.231-.027 4.199.488 6.123 1.492 4.024 2.1 6.476 7.11 5.505 11.311-1.135 4.916-5.788 8.628-10.846 8.629-10.773.001-21.547-.008-32.321-.017-.551-.001-1.108-.006-1.653-.076-6.581-.846-12.837-2.632-18.385-6.431-7.073-4.845-12.489-11.017-15.397-19.208-.27-.76-.686-1.469-1.035-2.201M90.208-44.087l.364-.432c-1.316-1.292-2.644-2.572-3.945-3.88C75.426-59.66 64.23-70.928 53.032-82.193c-3.263-3.281-6.562-6.526-9.781-9.85-4.004-4.136-4.04-9.023-.823-13.53 2.443-3.423 7.349-5.017 11.374-3.796 2.117.641 3.802 1.898 5.336 3.433 9.423 9.427 18.845 18.855 28.284 28.265 13.106 13.068 26.254 26.093 39.329 39.192 5.742 5.752 9.993 12.466 12.425 20.278 2.031 6.523 3.029 13.128 2.175 19.987-.55 4.414-1.481 8.717-3.133 12.823-3.331 8.281-8.328 15.357-15.413 20.92-5.848 4.592-12.333 7.81-19.552 9.541-5.417 1.298-10.907 1.593-16.45 1.057a46.903 46.903 0 0 1-12.832-3.077c-6.964-2.761-13.026-6.865-18.265-12.243-5.012-5.144-10.143-10.172-15.223-15.25-2.208-2.207-3.444-4.883-3.304-7.99.199-4.418 2.625-7.514 6.509-9.354 3.958-1.875 7.749-1.186 10.928 1.756 3.698 3.421 7.323 6.937 10.77 10.609 4.594 4.894 10.113 6.986 16.739 6.226 4.662-.535 8.526-2.573 11.554-6.198 5.756-6.89 5.609-17.886-1.073-24.562-2.833-2.831-5.657-5.672-8.504-8.489-2.203-2.178-4.789-3.906-7.778-4.557-6.963-1.514-13.275-.264-18.484 5.035-6.439 6.55-12.958 13.022-19.455 19.515-1.024 1.024-2.028 2.099-3.188 2.95-3.447 2.531-7.229 3.205-11.062 1.084-4.032-2.232-6.366-5.654-6.052-10.478.17-2.621 1.501-4.688 3.305-6.495 7.565-7.574 15.087-15.191 22.726-22.689 1.857-1.822 3.996-3.416 6.19-4.826 8.243-5.298 17.318-7.031 26.947-5.651 4.097.587 8.113 1.683 11.693 3.945.38.24.84.353 1.264.525M-8.723-84.715c-.77-.162-1.178-.212-1.564-.334-3.993-1.26-8.098-1.604-12.262-1.633-4.567-.032-9.096.133-13.577 1.169-6.309 1.458-12.224 3.76-17.705 7.271-11.462 7.341-19.137 17.559-23.356 30.409-1.183 3.601-2.006 7.314-2.078 11.156-.063 3.306-.348 6.61-.352 9.915-.039 30.047-.039 60.094-.047 90.142-.001 1.918-.219 3.818.214 5.751 1.569 6.997 6.018 11.204 12.744 13.002 1.94.518 4.128.295 6.182.136 1.473-.114 1.829.185 2.306 1.384 3.007 7.561 10.916 11.752 18.801 9.94 1.363-.313 2.155-.045 2.947 1.102 3.11 4.502 7.322 7.251 12.874 7.675 3.546.271 6.877-.554 9.896-2.386 4.223-2.564 6.831-6.352 7.939-11.159.153-.663.178-1.368.177-2.053-.009-7.944-.018-15.887-.06-23.831-.049-9.176-.131-18.352-.2-27.528-.014-1.838.289-2.122 2.167-2.111 7.316.042 14.634.203 21.946.073 6.576-.117 11.102-3.686 14.09-9.325.825-1.558 1.651-3.213 1.262-5.129-.042-.208.197-.474.385-.887.465.32.88.523 1.188.832 6.434 6.453 12.709 13.073 19.323 19.335 5.73 5.426 12.562 9.136 20.123 11.551 10.912 3.485 21.859 3.633 32.83.559 8.724-2.444 16.35-6.876 22.913-13.181 6.871-6.6 11.846-14.368 14.642-23.454.969-3.149 1.579-6.443 1.993-9.716.423-3.338.719-6.752.505-10.096-.36-5.651-1.332-11.243-3.396-16.569-2.415-6.229-5.677-11.983-10.102-17.004-2.326-2.639-4.86-5.096-7.347-7.589a51383.997 51383.997 0 0 0-49.491-49.556 1288.346 1288.346 0 0 0-14.757-14.538c-6.151-5.955-16.253-6.191-22.686-.545-.973.854-1.731 1.958-2.556 2.974-1.017 1.252-1.169 1.297-2.544.502-2.126-1.229-4.519-1.32-6.83-1.252-6.019.177-10.697 2.873-13.879 8.042-.444.72-.788 1.442-1.907 1.068-3.805-1.271-7.498-.664-11.062.913-4.892 2.163-7.776 6.043-9.129 11.117-.312 1.169-.358 2.41-.56 3.858"
      />
    </g>
  </svg>;
}
// interface IconMenuProps {

// }

export function IconMenu(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class={props.classNames || ""}
    >
      <path
        fill="currentColor"
        d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"
      />
    </svg>
  );
}
export function IconPlay(props: IconProps) {
  return (
    <svg
      class={props.classNames || ""}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M10 16.5v-9l6 4.5M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

export function LoadingSpinner(props: IconProps) {
  return (
    <svg
      class={`animate-spin ${props.classNames}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
export function IconChapBack(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20 5v14L8 12zM4 5v14"
      ></path>
    </svg>
  );
}
export function IconChapNext(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 5v14l12-7zm16 0v14"
      ></path>
    </svg>
  );
}
export function SpeedIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="m20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1a10 10 0 0 0-.27-10.44z"
      ></path>
      <path
        fill="currentColor"
        d="M10.59 15.41a2 2 0 0 0 2.83 0l5.66-8.49l-8.49 5.66a2 2 0 0 0 0 2.83z"
      ></path>
    </svg>
  );
}
export function IconMoon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      class={props.classNames || ""}
    >
      <path
        fill="currentColor"
        d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21Z"
      />
    </svg>
  );
}
export function IconSun(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      class={props.classNames || ""}
    >
      <path
        fill="currentColor"
        d="M12 5q-.425 0-.713-.288T11 4V2q0-.425.288-.713T12 1q.425 0 .713.288T13 2v2q0 .425-.288.713T12 5Zm4.95 2.05q-.275-.275-.275-.687t.275-.713l1.4-1.425q.3-.3.712-.3t.713.3q.275.275.275.7t-.275.7L18.35 7.05q-.275.275-.7.275t-.7-.275ZM20 13q-.425 0-.713-.288T19 12q0-.425.288-.713T20 11h2q.425 0 .713.288T23 12q0 .425-.288.713T22 13h-2Zm-8 10q-.425 0-.713-.288T11 22v-2q0-.425.288-.713T12 19q.425 0 .713.288T13 20v2q0 .425-.288.713T12 23ZM5.65 7.05l-1.425-1.4q-.3-.3-.3-.725t.3-.7q.275-.275.7-.275t.7.275L7.05 5.65q.275.275.275.7t-.275.7q-.3.275-.7.275t-.7-.275Zm12.7 12.725l-1.4-1.425q-.275-.3-.275-.713t.275-.687q.275-.275.688-.275t.712.275l1.425 1.4q.3.275.288.7t-.288.725q-.3.3-.725.3t-.7-.3ZM2 13q-.425 0-.713-.288T1 12q0-.425.288-.713T2 11h2q.425 0 .713.288T5 12q0 .425-.288.713T4 13H2Zm2.225 6.775q-.275-.275-.275-.7t.275-.7L5.65 16.95q.275-.275.687-.275t.713.275q.3.3.3.713t-.3.712l-1.4 1.4q-.3.3-.725.3t-.7-.3ZM12 18q-2.5 0-4.25-1.75T6 12q0-2.5 1.75-4.25T12 6q2.5 0 4.25 1.75T18 12q0 2.5-1.75 4.25T12 18Z"
      />
    </svg>
  );
}
export function IconDownload(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      class={props.classNames || ""}
    >
      <path
        fill="currentColor"
        d="M7 17h10v-2H7v2Zm5-3l4-4l-1.4-1.4l-1.6 1.55V6h-2v4.15L9.4 8.6L8 10l4 4Zm0 8q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"
      />
    </svg>
  );
}
