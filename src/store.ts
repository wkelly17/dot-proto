import {createSignal, createEffect, createMemo} from "solid-js";
const [playerSrc, setPlayerSrc] = createSignal();
const [player, setPlayer] = createSignal();
const [selectForDownload, setSelectForDownload] = createSignal(false);
const [selectedLinks, setSelectedLinks] = createSignal([]);
const [seletedLinksNames, setSelectedLinksNames] = createSignal([]);
const [selectedLinksSizes, setSeletedLinksSizes] = createSignal([]);
const [downloadHref, setDownloadHref] = createSignal("");
const [allVideos, setAllVideos] = createSignal();

const [filterQuery, setFilterQuery] = createSignal("");

// HANDLERS
function manageSelectedLink(
  e: Event,
  src: string,
  srcName: string,
  size: string
) {
  const target = e.target as HTMLInputElement;
  const links = selectedLinks();
  const names = seletedLinksNames();
  const sizes = selectedLinksSizes();
  let newLinks;
  let newNames;
  let newSizes;
  if (target.checked) {
    newLinks = [...links, src];
    newNames = [...names, srcName];
    newSizes = [...sizes, size];
  } else {
    newLinks = links.filter((link) => link != src);
    newNames = names.filter((name) => name != srcName);
    newSizes = sizes.filter((name) => name != srcName);
  }
  setSelectedLinks(newLinks);
  setSelectedLinksNames(newNames);
  setSeletedLinksSizes(newSizes);
}

// DERIVED VALUES
const batchDownloadHref = createMemo(() => {
  let finalHref;
  if (!selectedLinks().length) {
    finalHref = "";
    return finalHref;
  }
  const href = encodeURIComponent(JSON.stringify(selectedLinks()));
  const namesHref = encodeURIComponent(JSON.stringify(seletedLinksNames()));
  const sizesHref = encodeURIComponent(JSON.stringify(selectedLinksSizes()));
  const sizesArr = selectedLinksSizes();
  let size = "";
  if (sizesArr.length) {
    size = sizesArr?.reduce((prev, next) => Number(prev) + Number(next));
  }
  finalHref = `2test.zip?src=${href}&names=${namesHref}&size=${size}`;
  return finalHref;
});
const filteredPlaylist = createMemo(() => {
  const query = filterQuery();

  if (!query) {
    return allVideos();
  } else {
    let filtered = allVideos().filter((vid) => {
      return vid.name?.toLowerCase().normalize().includes(query);
    });
    let filteredByBucket = allVideos()
      .map((group) => {
        return group.filter((vid) => {
          return vid.name?.toLowerCase().normalize().includes(query);
        });
      })
      .filter((arr) => arr.length);
    console.log({filteredByBucket});
    return filteredByBucket;
  }
});

function getMp4Src(idx) {
  const corresponding = allVideos()[idx]?.find((src) => {
    return src && src.container == "MP4";
  });
  if (!corresponding) return;
  return corresponding.src;
}

export {
  playerSrc,
  setPlayerSrc,
  player,
  setPlayer,
  selectForDownload,
  setSelectForDownload,
  selectedLinks,
  setSelectedLinks,
  downloadHref,
  setDownloadHref,
  allVideos,
  setAllVideos,
  manageSelectedLink,
  batchDownloadHref,
  filteredPlaylist,
  setFilterQuery,
};
