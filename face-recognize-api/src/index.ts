import '@tensorflow/tfjs-node';
import express, { Request, Response } from "express";
import cors from "cors";
import {
  CompareFaceBody,
  CompareFaceDescriptionBody,
  CreateDescriptionBody,
} from "./types";
import {
  compareFaceWithDescription,
  compareFaces,
  createFaceDescription,
  loadModels,
} from "./utils";

const app = express();

app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json({ limit: "50mb" }));

app.get("/", (req: Request, res: Response): Response => {
  return res.json({ message: "Halo Dunia!" });
});

app.post("/", (req: Request, res: Response): Response => {
  return res.json(req.body);
});

app.post("/create-face-description", async (req: Request, res: Response) => {
  try {
    const response = await createFaceDescription(
      req.body as CreateDescriptionBody
    );

    if (!response) {
      return res.status(404).json({ message: "Face Not Found!" });
    }

    return res.json({ face_description: response });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.post(
  "/compare-face-with-description",
  async (req: Request, res: Response) => {
    try {
      const response = await compareFaceWithDescription(
        req.body as CompareFaceDescriptionBody
      );

      if (!response) {
        return res.status(404).json({ message: "Face Not Found!" });
      }

      return res.json(response);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
);

app.post("/compare-faces", async (req: Request, res: Response) => {
  try {
    const response = await compareFaces(req.body as CompareFaceBody);

    if (!response) {
      return res.status(404).json({ message: "Face Not Found!" });
    }

    return res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

const start = async (): Promise<void> => {
  try {
    await loadModels();
    app.listen(4000, () => {
      console.log("Server started on port 4000");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
