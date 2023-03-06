import {clientsClaim} from "workbox-core";
import {downloadZip} from "client-zip";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
self.skipWaiting();
clientsClaim();
let precacheUrls = self.__WB_MANIFEST;

precacheAndRoute(precacheUrls);

// self.addEventListener("fetch", async (event) => {
//   if (event.request.url.match(/test\.zip(\?.*)?$/)) {
//     ;
//     ;
//     const url = new URL(event.request.url);
//     const params = new URLSearchParams(url.search);
//     const srcs = params.get("src");
//     const names = params.get("names");
//     for (const [key, value] of params.entries()) {
//       console.log(`${key}, ${value}`);
//     }
//     const arr = JSON.parse(srcs);
//     const arrNames = JSON.parse(names);
//     console.log({arr});
//     const arrUrls = arr;
//     const transformStream = new TransformStream();
//     const zipWriter = new zip.ZipWriter(transformStream);
//     event.respondWith(new Response(transformStream.readable));
//     addFiles(zipWriter, arrUrls, arrNames).catch((error) =>
//       console.error(error)
//     );
//   }
// });

self.addEventListener("fetch", async (event) => {
  if (event.request.url.match(/2test\.zip(\?.*)?$/)) {
    debugger;
    const url = new URL(event.request.url);
    const params = new URLSearchParams(url.search);
    const srcs = params.get("src");
    const names = params.get("names");
    let size = params.get("size");
    size = size && Number(size);
    for (const [key, value] of params.entries()) {
      console.log(`${key}, ${value}`);
    }
    const arr = JSON.parse(srcs);
    const arrNames = JSON.parse(names);
    console.log({arr});
    const arrUrls = arr;

    // const fetchPromises = arrUrls.map((url) => {
    //   return fetch(url);
    // });
    async function* lazyFetch() {
      for (const [index, url] of arrUrls.entries()) {
        const resp = await fetch(url);
        const data = {
          name: arrNames[index],
          input: resp.body,
          lastModified: resp.headers.get("last-modified"),
        };
        yield data;
      }
    }
    let {readable, writable} = new TransformStream();

    event.respondWith(
      new Response(readable, {
        headers: {
          "Content-Type": "application/octet-stream; charset=utf-8",
          "Content-Disposition": 'attachment; filename="dot.zip"',
          "Content-Length": size,
        },
      })
    );
    const blob = downloadZip(lazyFetch());
    blob.body?.pipeTo(writable);
    // Promise.all(fetchPromises).then(async (responses) => {
    //   let metadata = [];
    //   const arrObj = responses.map((response, idx) => {
    //     // console.log(...res1.headers);
    //     // thing = res1.headers.get("Accept-Ranges");
    //     console.log(...response.headers);
    //     metadata.push({
    //       name: arrNames[idx],
    //       size: response.headers.get("content-length"),
    //       input: response.body,
    //     });
    //     return {
    //       name: arrNames[idx],
    //       input: response.body,
    //       lastModified: response.headers.get("last-modified"),
    //     };
    //   });
    //   console.log({arrObj});
    //   const blob = downloadZip(arrObj, {
    //     metadata: metadata,
    //   });
    //   blob.body?.pipeTo(writable);
    //   // event.respondWith(new Response(readable));
    // });
  }
});

// async function addFiles(zipWriter, urls, names) {
//   console.log({urls, names});
//   // const res1 = await fetch(urls[0]);
//   const fetchPromises = urls.map((url) => {
//     return fetch(url);
//   });
//   Promise.all(fetchPromises).then(async (responses) => {
//     responses.forEach((res, idx) => {
//       zipWriter.add(`${names[idx]}.mp4`, res.body);
//     });
//     await zipWriter.close();
//   });
//   // console.log(...res1.headers);
//   // const thing = res1.headers.get("Accept-Ranges");
//   // console.log({thing});
//   // const res2 = await fetch(urls[1]);
//   // await urls.forEach(async (url, idx) => {
//   //   try {
//   //     const resp = await fetch(url);
//   //     if (!resp.body) return;
//   //     zipWriter.add(String(idx), resp.body);
//   //   } catch (error) {
//   //     console.log({error});
//   //   }
//   // });
//   // const transformStream = new TransformStream();
//   // const zipWriter = new zip.ZipWriter(transformStream);
//   // zipWriter.add("test1.mp4", res1.body, {
//   //   level: 9,
//   //   onprogress: (progress, total) => {},
//   // });
//   // zipWriter.add("test2.mp4", res2.body, {
//   //   level: 9,
//   //   onprogress: (progress, total) => {},
//   // });
//   // zipWriter.add("test2.mp4", res2.body);
//   // await zipWriter.add("test1.mp4", res1.body);
//   // you can put a breakpoint here to verify the "save as" popup is displayed before the zip file is closed
//   // await zipWriter.add(
//   //   "test2.mp4",
//   //   new zip.Uint8ArrayReader(new Uint8Array(1024 * 1024 * 64)),
//   //   {level: 0}
//   // );
//   // await zipWriter.add(
//   //   "test1",
//   //   new zip.Uint8ArrayReader(new Uint8Array(1024 * 1024 * 64)),
//   //   {level: 0}
//   // );
//   // // you can put a breakpoint here to verify the "save as" popup is displayed before the zip file is closed
//   // await zipWriter.add(
//   //   "test2",
//   //   new zip.Uint8ArrayReader(new Uint8Array(1024 * 1024 * 64)),
//   //   {level: 0}
//   // );
//   // await zipWriter.close();
//   // await zipWriter.close();
// }

// self.addEventListener("fetch", (event) => {
// 	if (event.request.url.match(/test\.zip(\?.*)?$/)) {

//     event.waitUntil(
//       (async () => {
//         // Exit early if we don't have access to the client.
//         // Eg, if it's cross-origin.

//         if (!event.clientId) return;

//         // // Get the client.
//         const client = await clients.get(event.clientId);
//         // // Exit early if we don't get the client.
//         // // Eg, if it closed.
//         if (!client) return;

//         // // Send a message to the client.
//         // client.postMessage({
//         //   msg: "Hey I just got a fetch from you!",
//         //   url: event.request.url,
//         // });
//         const transformStream = new TransformStream();
//         const zipWriter = new zip.ZipWriter(transformStream);
//         event.respondWith(new Response(transformStream.readable));
//         addFiles(zipWriter, client).catch((error) => console.error(error));
//       })()
//     );
//   }
// });
