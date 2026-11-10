import multer from "multer";
import path from "path";
import fs from "fs";

export const upload = () => {
  const uploadPath = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (
      req: Express.Request,
      file: Express.Multer.File,
      cb: Function,
    ) {
      cb(null, uploadPath);
    },

    filename: function (
      req: Express.Request,
      file: Express.Multer.File,
      cb: Function,
    ) {
      const uniqueName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "-" +
        file.originalname;

      cb(null, uniqueName);
    },
  });

  return multer({ storage });


};


export const getImageUrl = (file?: Express.Multer.File) =>
  file?.path
    ? `${process.env.SERVER_URL}/${file.path.replace(/\\/g, "/")}`
    : undefined;