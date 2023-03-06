import type {APIRoute} from "astro";
import * as zip from "@zip.js/zip.js";
import {Readable} from "stream";

const tempUrl1 =
  "http://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4?akamai_token=exp=1677706519~acl=/media/v1/pmp4/static/clear/6314154063001/9326e827-2495-44ae-8c16-b62f975097ef/004862c2-85e2-46bd-b577-90465520b93f/main.mp4*~hmac=b525dfa3ecdf5ebc851b64a00852afe69b509705a8328370722999221c2e15b7";
const tempUrl2 =
  "http://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/6314154063001/5495e2a7-8f94-4048-8759-58828b2d248a/dd62a4a0-3c8a-4ed8-ada4-369db9ae0c75/main.mp4?akamai_token=exp=1677710262~acl=/media/v1/pmp4/static/clear/6314154063001/5495e2a7-8f94-4048-8759-58828b2d248a/dd62a4a0-3c8a-4ed8-ada4-369db9ae0c75/main.mp4*~hmac=55d2935e04b59e27fcf0d4689c6571485c3c73a79028d35ed3f2bd33834f33f6";

export const get: APIRoute = async function get({params, request}) {
  const resp = await fetch(tempUrl1);
  const resp2 = await fetch(tempUrl2);
  if (!resp.body) return new Response();
  if (!resp2.body) return new Response();

  // let zipFs = new zip.fs.FS();
  // const {readable, writable} = new TransformStream();
  // zipFs.addReadable("test.mp4", resp.body);
  // zipFs.addReadable("test2.mp4", resp2.body);

  const size = resp.headers.get("Content-Length");
  // const headers = new Headers({
  //   "Content-Type": "application/zip;",
  //   "Content-Disposition": 'attachment; filename="ex.zip"',
  //   // "Content-Encoding": "gzip",
  // });
  const headers = new Headers({
    "Content-Type": "application/octet-stream; charset=utf-8",
    "Content-Disposition": 'attachment; filename="ex.zip"',
    // "Content-Encoding": "gzip",
  });

  // if (size) {
  //   headers.append("Content-Length", size);
  // }

  return new Response(x, {
    headers,
    status: 200,
  });
};

async function addFiles(zipWriter) {
  await zipWriter.add(
    "test1",
    new zip.Uint8ArrayReader(new Uint8Array(1024 * 1024 * 64)),
    {level: 0}
  );
  // you can put a breakpoint here to verify the "save as" popup is displayed before the zip file is closed
  await zipWriter.add(
    "test2",
    new zip.Uint8ArrayReader(new Uint8Array(1024 * 1024 * 64)),
    {level: 0}
  );
  await zipWriter.close();
}
