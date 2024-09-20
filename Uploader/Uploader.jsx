import React, { useEffect, useState } from "react";
import styles from "./Uploader.module.scss";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import app from "./components/firebase";
import { Convert } from "./components/WebP";

// *************************************************************************************************** //
//                                          PROPS                                                      //
// type = [STRING] image | video | file                                                                //
// visualization = [CALLBACK] Function with the uploaded url in parameters                             //
// getFileName = [CALLBACK] Function with the filename in parameters                                   //
//                                                                                                     //
//**************************************************************************************************** //
export default function Uploader({
  type = "image",
  visualization = () => {},
  getFileName = () => {},
}) {
  const [img, setImg] = useState(null);
  const [imgURL, setImgURL] = useState("");
  const [imgProgress, setImgProgress] = useState(0);

  useEffect(() => {
    visualization(null);
    setImg(null);
    setImgURL("");
    setImgProgress(0);
  }, [type]);

  useEffect(() => {
    visualization(imgURL);
  }, [imgURL]);
  const storageRoad = (filename) => {
    return `Uploads/${type}/${filename}`;
  };

  const uploadFile = async (file) => {
    if (!file) return;
    const storage = getStorage(app);
    const filename = file.name;
    const storageRef = ref(
      storage,
      storageRoad(
        type === "image"
          ? filename.substring(
              0,
              filename.length - (filename.length - filename.lastIndexOf("."))
            ) + ".webp"
          : filename
      )
    );
    getFileName(() => {
      return type === "image"
        ? filename.substring(
            0,
            filename.length - (filename.length - filename.lastIndexOf("."))
          ) + ".webp"
        : filename;
    });
    let convertedFile;
    if (type === "image") convertedFile = await Convert(file);
    else convertedFile = file;
    const uploadTask = uploadBytesResumable(storageRef, convertedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
        setImgProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (err) => {
        switch (err.code) {
          case "storage/unauthorized":
            console.error("Accès non autorisé");
            break;
          default:
            console.error(err);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgURL(downloadURL.toString());
        });
      }
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    await uploadFile(img);
  }

  return (
    <div className={`f-center mhfull flex-column`}>
      <form
        onSubmit={handleSubmit}
        className="f-center gap-10 align-items-center mb-20"
      >
        <div className="f-center gap-10">
          <input
            type="file"
            name={
              type === "image" ? "img" : type === "video" ? "video" : "file"
            }
            accept={
              type === "image"
                ? "image/*"
                : type === "video"
                ? "video/*"
                : ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }
            onChange={(e) => setImg(() => e.target.files[0])}
          />
        </div>
        <button className="btn btn-primary">Mettre en ligne</button>
      </form>
      {imgProgress > 0 ? `téléchargement ${imgProgress}%` : ""}
    </div>
  );
}
