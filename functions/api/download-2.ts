// import {downloadZip, makeZip} from "client-zip";
// import * as zip from "@zip.js/zip.js";

// export const onRequestPost: PagesFunction = async (context) => {
//   console.log("REQUEST TO DOWNLOAD!");
//   // Contents of context object
//   // const {
//   //   request, // same as existing Worker API
//   //   env, // same as existing Worker API
//   //   params, // if filename includes [id] or [[path]]
//   //   waitUntil, // same as ctx.waitUntil in existing Worker API
//   //   next, // used for middleware or to fetch assets
//   //   data // arbitrary space for passing data between middlewares
//   // } = context

//   const request: Request = context.request;
//   const env: any = context.env;
//   const url = new URL(request.url);
//   let src = url.searchParams?.get("src") as string;

//   // if (!allParamsAreValid([user, repo, book])) {
//   //   return new Response(null, {
//   //     status: 400,
//   //     statusText: "Missing parameters",
//   //   });
//   // }

//   try {
//     // http://localhost/u/WA-Catalog/en_ulb/index.json;
//     let baseUrl = "http://127.0.0.1:8788/api";
//     const tempUrl =
//       "http://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4?akamai_token=exp=1677706519~acl=/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4*~hmac=b525dfa3ecdf5ebc851b64a00852afe69b509705a8328370722999221c2e15b7";

//     const transformStream = new TransformStream();
//     const zipWriter = new zip.ZipWriter(transformStream);

//     addFiles(zipWriter).catch((error) => console.error(error));
//     const response = new Response(transformStream.readable, {
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Content-Type": "application/zip",
//         "Content-Disposition": "attachment; filename=devices.zip",
//       },
//     });
//     return response;
//     // event.respondWith(new Response(transformStream.readable));
//   } catch (error) {
//     console.error(error);
//     return new Response(null, {
//       status: 404,
//     });
//   }
// };

// async function addFiles(zipWriter: any) {
//   const tempUrl =
//     "http://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4?akamai_token=exp=1677706519~acl=/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4*~hmac=b525dfa3ecdf5ebc851b64a00852afe69b509705a8328370722999221c2e15b7";
//   const u8 = await fetch(tempUrl);
//   if (!u8.body) return;
//   await zipWriter.add("one.mp4", new zip.HttpRangeReader(tempUrl), {level: 0});

//   // you can put a breakpoint here to verify the "save as" popup is displayed before the zip file is closed
//   // await zipWriter.add(
//   //   "test2",
//   //   new zip.Uint8ArrayReader(new Uint8Array(1024 * 1024 * 64)),
//   //   {level: 0}
//   // );
//   await zipWriter.close();
// }
