import {
  srcToWebP,
  blobToWebP,
  arrayBufferToWebP,
} from "webp-converter-browser";
import Compressor from "./Compressor";

export async function Convert(file) {
  console.log(file);
  try {
    const webpBlob = await arrayBufferToWebP(await Compressor(file));
    console.log(webpBlob);
    return webpBlob;
  } catch (error) {
    console.error(error);
  }
}
