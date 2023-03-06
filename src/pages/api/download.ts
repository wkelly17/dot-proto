// import type {APIRoute} from "astro";
// import {downloadZip} from "client-zip";

// export const get: APIRoute = async function get({params, request}) {
//   // console.log({params, request});
//   // console.log(request.url);
//   const propUrl = new URL(request.url);
//   const queryParam = propUrl.searchParams.get("src") as string;
//   const tempUrl =
//     "http://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4?akamai_token=exp=1677647300~acl=/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4*~hmac=d814dfc12ff92e09b53b35e1bb67afd0ae80be5898d703a0e077197e6431b7fd";
//   const fetchUrl = params.download as string;
//   // console.log({fetchUrl});
//   console.log("FETCHING!");
//   const resp = await fetch(tempUrl);
//   // const data = await resp.blob();
//   // const buff = Buffer.from(await resp.arrayBuffer());
//   // console.log({resp});
//   // console.log({data});
//   console.log("Sending response!");
//   const size = resp.headers.get("Content-Length");
//   const headers = new Headers({
//     "Content-Type": "application/octet-stream; charset=utf-8",
//     "Content-Disposition": 'attachment; filename="filename2.mp4"',
//     // "Content-Encoding": "gzip",
//   });

//   if (size) {
//     headers.append("Content-Length", size);
//   }

//   const thing1 = await fetch(tempUrl);
//   const thing2 = await fetch(
//     "https://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/6314154063001/dbeaa783-b7b8-4a7c-865b-b008cbfbdec2/1798d217-a01f-4b90-b468-b2908a0b02b0/main.mp4?akamai_token=exp=1677648502~acl=/media/v1/pmp4/static/clear/6314154063001/dbeaa783-b7b8-4a7c-865b-b008cbfbdec2/1798d217-a01f-4b90-b468-b2908a0b02b0/main.mp4*~hmac=c8facce3d2abaea4dc6a8f8d91acb19ec7524253ec1565e7989f781353153626"
//   );

//   return new Response(resp.body, {
//     headers,
//     status: 200,
//   });
// };
