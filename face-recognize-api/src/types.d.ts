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
