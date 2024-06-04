import { NextApiRequest, NextApiResponse } from "next";
import formidable, { ErrorData, Fields, Files } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err: ErrorData, fields: Fields, files: Files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      const file = files.file as formidable.File;
      const fileName = `${Date.now()}-${file.originalFilename}`;
      const filePath = path.join(process.cwd(), "public", "images", fileName);

      try {
        await fs.promises.writeFile(filePath, file.buffer);
        res.status(200).json({ message: "File uploaded successfully" });
      } catch (error) {
        console.error("Error writing file:", error);
        res.status(500).json({ error: "Error writing file" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}