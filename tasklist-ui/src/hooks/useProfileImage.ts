import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiService";

export const useProfileImage = (token: string | null | undefined) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);
        const imageBlob = await apiRequest<Blob>(`UserProfile/Profile/Image`, {
          method: "GET",
          token,
          responseType: "blob",
        });
        
        // Revoke previous URL to avoid memory leaks
        if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
        setProfileImageUrl(URL.createObjectURL(imageBlob));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch profile image");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, [token]);

  // Clean up object URL on unmount or when URL changes
  useEffect(() => {
    return () => {
      if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
    };
  }, [profileImageUrl]);

  return { profileImageUrl, loading, error };
};
