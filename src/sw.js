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
  if (event.request.url.match(/sw-handle-saving/)) {
    async function handleFormRequest() {
      const formData = await event.request.text();
      const parameterized = new URLSearchParams(formData);
      let payloadData;
      const downloadToDevice = parameterized.get("swDownloadDevice") == "true";
      const saveToSw =
        parameterized.get("swSaveSw") ==
        "true"; /* String, not boolean compare.  url encoded is sending strings */
      const saveToSw2 = parameterized.get("swSaveSws");
      try {
        payloadData = await JSON.parse(parameterized.get("swPayload"));
      } catch (error) {
        console.error(error);
        return;
      }
      const totalSize = payloadData.reduce(
        (sum, current) => sum + current.size,
        0
      );
      console.log({totalSize});

      // const fetchPromises = arrUrls.map((url) => {
      //   return fetch(url);
      // });
      async function* lazyFetch() {
        for (const srcObj of payloadData) {
          const resp = await fetch(srcObj.src);
          const [readableDownload, readableSw] = resp.body.tee();
          sendItToSw(srcObj.refId, readableSw, resp);
          const data = {
            name: `${srcObj.name}.mp4`,
            input: readableDownload,
            lastModified: resp.headers.get("last-modified"),
          };
          yield data;
        }
      }
      async function sendItToSw(name, stream, originalResp) {
        const testCache = await caches.open("vidDownloads");
        const res = new Response(stream, {
          headers: {
            "Content-Length": originalResp.headers.get("Content-Length"),
            "Content-Type": "video/mp4",
          },
        });
        testCache.put(name, res);
      }
      let {readable, writable} = new TransformStream();
      console.log("event responsd with");
      const response = downloadZip(lazyFetch());
      response.body?.pipeTo(writable);
      return new Response(readable, {
        headers: {
          "Content-Type": "application/octet-stream; charset=utf-8",
          "Content-Disposition": 'attachment; filename="dot.zip"',
          "Content-Length": totalSize,
        },
      });
    }
    event.respondWith(handleFormRequest());
  }
});

// AJAX option to save things.  Always will save to sw, and then the download to client is fast. Streaming through the form and just urlencoding is probably better though since the client can monitor, see progress, and cancel.
self.addEventListener("fetch", async (event) => {
  if (event.request.url.match(/sw-save\.zip(\?.*)?$/)) {
    // debugger;
    const url = new URL(event.request.url);
    const params = new URLSearchParams(url.search);
    const srcs = params.get("src");
    const names = params.get("names");
    const refIds = params.get("refids");
    let size = params.get("size");
    size = size && Number(size);
    const arr = JSON.parse(srcs);
    const arrNames = JSON.parse(names);
    const arrRefIds = JSON.parse(refIds);
    console.log({arr});
    const arrUrls = arr;

    // const fetchPromises = arrUrls.map((url) => {
    //   return fetch(url);
    // });

    // for await (const [index, url] of arrUrls.entries()) {
    //   const resp = await fetch(url);
    //   const res = new Response(resp.body, {
    //     headers: {
    //       "Content-Length": resp.headers.get("Content-Length"),
    //       "Content-Type": "video/mp4",
    //     },
    //   });
    //   await testCache.put(arrNames[index], res);
    //   finished.push(arrNames[index]);
    // }
    async function getThemAll() {
      const testCache = await caches.open("vidDownloads");
      const finished = [];
      const promises = Array.from(arrUrls.entries()).map(
        async ([index, url]) => {
          const resp = await fetch(url);
          const clone = resp.clone();
          const res = new Response(resp.body, {
            headers: {
              "Content-Length": resp.headers.get("Content-Length"),
              "Content-Type": "video/mp4",
            },
          });
          await testCache.put(arrRefIds[index], res);
          const blobForBrowser = await clone.blob();
          return {
            input: blobForBrowser,
            name: `${arrNames[index]}.mp4`,
          };
        }
      );
      console.log();
      const results = await Promise.all(promises);
      const zipForBrowser = await downloadZip(results).blob();
      return new Response(zipForBrowser, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    event.respondWith(getThemAll());
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
