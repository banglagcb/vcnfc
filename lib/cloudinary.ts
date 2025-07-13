import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export const uploadImage = async (
  file: string | Buffer,
  folder: string = "shareinfo",
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  },
): Promise<CloudinaryUploadResult> => {
  try {
    const result = await cloudinary.uploader.upload(file as string, {
      folder,
      transformation: [
        {
          width: options?.width || 800,
          height: options?.height || 600,
          crop: options?.crop || "limit",
          quality: options?.quality || "auto:good",
        },
      ],
      allowed_formats: ["jpg", "png", "webp", "gif"],
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
};

export const getOptimizedImageUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  },
): string => {
  return cloudinary.url(publicId, {
    width: options?.width || 400,
    height: options?.height || 300,
    crop: options?.crop || "fill",
    quality: options?.quality || "auto:good",
    format: options?.format || "auto",
    fetch_format: "auto",
  });
};
