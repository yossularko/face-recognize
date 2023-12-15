export interface ImageObj {
  name: string;
  uri: string;
  type: string;
}

export interface CreateDescriptionBody {
  image: string;
}

export interface CompareFaceDescriptionBody {
  face_description: string;
  image: string;
}

export interface CompareFaceBody {
  image_reference: string;
  image: string;
}
