import { useEffect, useState } from "react";
import type { UserProfileResponseDto } from "../models/ResponseDtos/UserProfileResponseDto";
import { apiRequest } from "../services/apiService";
import { tokenService } from "../services/tokenServices";
import type UserProfileModel from "../models/UserProfileModel";


export default function UserProfilePage() {

  const [userData, setUserData] = useState<UserProfileModel | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

 const getUserProfile = async() => {
    try{
        const token = tokenService.getAccessToken();        
        const result = await apiRequest<UserProfileResponseDto>(`UserProfile/Profile`, { method: "GET", token: token || undefined });
        if(result.success && result.responseData){
            console.log("User profile data:", result.responseData);
            setUserData(result.responseData);
        }
    }
    catch(error){
        console.error("Error fetching user profile:", error);
    }
 }

 useEffect(() => {
    getUserProfile();
 }, 
 []);   

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select an image first.");
      return;
    }
    const token = tokenService.getAccessToken();
    const formData = new FormData();
    formData.append("files", selectedFile); // backend expects List<IFormFile>, send single entry

    try {
      setUploading(true);
      setMessage(null);
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/UserProfile/UploadImage`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!resp.ok) throw new Error("Upload failed");
      setMessage("Image uploaded successfully.");
      setSelectedFile(null);
      await getUserProfile(); // refresh profile data
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      Welcome {userData?.displayName}
      <p>Email: {userData?.email}</p>

      <div className="mt-3 space-y-2">
        {!userData?.hasProfileImage && (
          <p>No profile image set. Would you like to upload one?</p>
        )}

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="Select profile image"
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-teal-50 file:text-teal-700
              hover:file:bg-teal-100"
          />
          {selectedFile && (
            <p className="text-sm text-slate-600">Selected: {selectedFile.name}</p>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-3 py-1.5 rounded bg-teal-500 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  )
}
