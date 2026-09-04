import { imagesRepository, type UploadImageInput } from "./images.repository";

export const imagesService = {
  async uploadImage(data: UploadImageInput) {
    return imagesRepository.upload(data);
  },
};
