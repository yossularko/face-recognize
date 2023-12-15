import * as faceapi from "@vladmandic/face-api";
import * as canvas from "canvas";
import { join } from "path";
import {
  CompareFaceBody,
  CompareFaceDescriptionBody,
  CreateDescriptionBody,
} from "./types";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function generateDescription(file: string) {
  const image = Buffer.from(
    file.replace(/^data:image\/jpeg;base64,/, ""),
    "base64"
  );
  const img = await canvas.loadImage(image);

  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    return null;
  }

  return detection.descriptor;
}

function encodeF32(data: Float32Array[]) {
  return JSON.stringify(Array.from(data));
}

function decodeF32(value: string) {
  const decodeString = JSON.parse(value) as any[];
  return decodeString.map((val) => new Float32Array(Object.values(val)));
}

function getMatchPercent(value: number) {
  const percent = (value * 100).toFixed(2);

  return 100 - Number(percent);
}

export const loadModels = async () => {
  await faceapi.nets.faceRecognitionNet.loadFromDisk(
    join(process.cwd(), "models")
  );
  await faceapi.nets.faceLandmark68Net.loadFromDisk(
    join(process.cwd(), "models")
  );
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(join(process.cwd(), "models"));
};

export const createFaceDescription = async (body: CreateDescriptionBody) => {
  const { image } = body;
  const face_description = await generateDescription(image);

  if (!face_description) {
    return null;
  }

  return encodeF32([face_description]);
};

export const compareFaceWithDescription = async (
  body: CompareFaceDescriptionBody
) => {
  const { face_description, image } = body;

  const imageReference = decodeF32(face_description);
  const imageCurrent = await generateDescription(image);

  if (!imageCurrent) {
    return false;
  }

  const faceMatcher = new faceapi.FaceMatcher(imageReference);
  const match = faceMatcher.findBestMatch(imageCurrent);

  return {
    isMatch: match.distance < 0.4,
    similar: getMatchPercent(match.distance),
  };
};

export const compareFaces = async (body: CompareFaceBody) => {
  const { image_reference, image } = body;

  const imageReference = await generateDescription(image_reference);
  const imageCurrent = await generateDescription(image);

  if (!imageReference || !imageCurrent) {
    return false;
  }

  const faceMatcher = new faceapi.FaceMatcher([imageReference]);
  const match = faceMatcher.findBestMatch(imageCurrent);

  return {
    isMatch: match.distance < 0.4,
    similar: getMatchPercent(match.distance),
  };
};
