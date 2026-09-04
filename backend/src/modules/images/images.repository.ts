export type UploadImageInput = {
  filename: string;
};

export const imagesRepository = {
  async upload(data: UploadImageInput) {
    console.log(`[IMAGES] Upload placeholder for: ${data.filename}`);
    return {
      url: `https://placeholder.com/uploads/${data.filename}`,
      filename: data.filename,
    };
  },
};
