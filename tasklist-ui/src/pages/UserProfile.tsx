import { useRef, useState } from "react";
import { apiRequest } from "../services/apiService";
import { tokenService } from "../services/tokenServices";
import { validateAndResizeImage } from "../utils/imageResizer";
import { useUserProfile } from "../hooks/useUserProfile";
import type { ResponseDto } from "../models/ResponseDtos/ResponseDto";
import type { FileUploadModel } from "../models/FileUploadModel";
import ToastWrapper from "../components/toastWrapper";
import toast from "react-hot-toast";


export default function UserProfilePage() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const token = tokenService.getAccessToken();

  const { userData, profileImageUrl, refetch } = useUserProfile(token);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const result = await validateAndResizeImage(file);

    if (result.success && result.file) {
      setSelectedFile(result.file);
    } else {
      toast.error(result.error || "Failed to process image.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }
    const token = tokenService.getAccessToken();
    const formData = new FormData();
    formData.append("files", selectedFile); // backend expects List<IFormFile>, send single entry

    try {
      setUploading(true);
      const response = await apiRequest<ResponseDto<FileUploadModel>>(`UserProfile/image`, {
        method: "POST",
        token: token || undefined,
        body: formData,
      });
      if (!response.success) {
        toast.error("Upload failed: " + response.message);
        return;
      }
      toast.success("Image uploaded successfully.");
      console.log("Upload response:", response.responseData);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refetch();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <ToastWrapper />
      <div className="flex justify-center items-start min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 mb-8 px-4">
            <p className="text-base sm:text-lg md:text-xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-teal-300 text-center">Welcome {userData?.displayName}</p>
          </div>

          <div className="flex justify-center mb-6">
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="h-40 w-40 rounded-full object-cover border-4 border-teal-300 shadow-lg"
              />
            )}
          </div>

          <div className="text-center mb-8">
            <p className="text-base sm:text-lg text-slate-400">Email: {userData?.email}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
            {!userData?.hasProfileImage && (
              <p className="text-slate-700 mb-4">No profile image set. Would you like to upload one?</p>
            )}
            {userData?.hasProfileImage && (
              <p className="text-slate-700 mb-4 font-semibold">Change your profile image:</p>
            )}
            <p className="text-red-700 mb-4 font-semibold">NOTE: Max size 500 X 600</p>

            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                aria-label="Select profile image"
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-teal-50 file:text-teal-700
                hover:file:bg-teal-100 cursor-pointer"
              />
              {selectedFile && (
                <p className="text-xs sm:text-sm text-teal-600 font-medium">Selected: {selectedFile.name}</p>
              )}
              <div>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded text-sm font-semibold bg-teal-500 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-teal-600 transition-all shadow"
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
