// import {downloadZip, makeZip} from "client-zip";

// export const onRequestGet: PagesFunction = async (context) => {
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
//       "http://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4?akamai_token=exp=1677647300~acl=/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4*~hmac=d814dfc12ff92e09b53b35e1bb67afd0ae80be5898d703a0e077197e6431b7fd";
//     // let finalUrl = `${baseUrl}//${repo}/source.usfm`;
//     let fileName = "videotests";
//     console.log("WRANGLER FETCHING!");
//     let response = await fetch(tempUrl);

//     const thing1 = await fetch(tempUrl);
//     // const thing1b = await thing1.blob();
//     const thing2 = await fetch(
//       "https://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/6314154063001/dbeaa783-b7b8-4a7c-865b-b008cbfbdec2/1798d217-a01f-4b90-b468-b2908a0b02b0/main.mp4?akamai_token=exp=1677648502~acl=/media/v1/pmp4/static/clear/6314154063001/dbeaa783-b7b8-4a7c-865b-b008cbfbdec2/1798d217-a01f-4b90-b468-b2908a0b02b0/main.mp4*~hmac=c8facce3d2abaea4dc6a8f8d91acb19ec7524253ec1565e7989f781353153626"
//     );
//     // const intro = {
//     //   name: "intro.txt",
//     //   lastModified: new Date(),
//     //   input: "Hello. This is the client-zip library.",
//     // };

//     // get the ZIP stream in a Blob
//     // const intro = {
//     //   name: "intro.mp4",
//     //   lastModified: new Date(),
//     //   input: ,
//     // };
//     const intro2 = {
//       name: "intro2.txt",
//       lastModified: new Date(),
//       input: "Hello. This is the client-zip library.",
//     };
//     const blob = downloadZip([intro2, thing1]);
//     // console.log({blob});
//     // const thing1B = await thing1.blob();
//     // const thing2B = await thing2.blob();
//     // const bigBlob = new Blob([thing1B]);

//     let {readable, writable} = new TransformStream();
//     blob.body?.pipeTo(writable);
//     // thing1?.body?.pipeTo(writable);
//     // thing2.body?.pipeTo(writable);

//     console.log("WRANLGER RESPONDING!");
//     let newResp = new Response(blob.body, {
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Content-Type": "application/octet-stream; charset=utf-8",
//         "Content-Disposition": 'attachment; filename="filename.zip"',
//       },
//     });
//     return newResp;
//   } catch (error) {
//     console.error(error);
//     return new Response(null, {
//       status: 404,
//     });
//   }
// };
