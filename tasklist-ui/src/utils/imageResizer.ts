/**
 * Resizes an image file to specified dimensions
 * Asked AI to create this function - Not my work!!!!!!!
 * @param file - The image file to resize
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - Image quality (0-1), default 0.8
 * @returns Promise<File> - The resized image as a File object
 */
export const resizeImage = async (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob from canvas"));
              return;
            }

            // Create a new File object from the blob
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(resizedFile);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Validates and resizes an image file
 * @param file - The image file to validate and resize
 * @param maxSizeInBytes - Maximum file size in bytes (default: 500KB)
 * @param maxDimensions - Maximum image dimensions {width, height} (default: 500x600)
 * @param targetDimensions - Target resize dimensions {width, height} (default: 400x500)
 * @param quality - Image quality for compression (0-1) (default: 0.85)
 * @returns Object with success status, resized file (if successful), and error message (if failed)
 */
export const validateAndResizeImage = async (
  file: File,
  maxSizeInBytes: number = 500 * 1024,
  maxDimensions: { width: number; height: number } = { width: 500, height: 600 },
  targetDimensions: { width: number; height: number } = { width: 400, height: 500 },
  quality: number = 0.85
): Promise<{ success: boolean; file?: File; error?: string }> => {
  // Check file size
  if (file.size > maxSizeInBytes) {
    return {
      success: false,
      error: `File size exceeds ${Math.round(maxSizeInBytes / 1024)}KB. Please choose a smaller image.`,
    };
  }

  try {
    // Validate dimensions
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = async () => {
          if (img.width > maxDimensions.width || img.height > maxDimensions.height) {
            resolve({
              success: false,
              error: `Image dimensions should be max ${maxDimensions.width}x${maxDimensions.height}px.`,
            });
            return;
          }

          try {
            // Resize the image
            const resizedFile = await resizeImage(
              file,
              targetDimensions.width,
              targetDimensions.height,
              quality
            );

            resolve({
              success: true,
              file: resizedFile,
            });
          } catch (err) {
            resolve({
              success: false,
              error: "Failed to resize image. Please try again.",
            });
          }
        };

        img.onerror = () => {
          resolve({
            success: false,
            error: "Failed to load image. Please choose a valid image file.",
          });
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        resolve({
          success: false,
          error: "Failed to read file.",
        });
      };

      reader.readAsDataURL(file);
    });
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
};
