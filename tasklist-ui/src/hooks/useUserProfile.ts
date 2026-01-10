import { useEffect, useState } from "react";
import type { UserProfileResponseDto } from "../models/ResponseDtos/UserProfileResponseDto";
import type UserProfileModel from "../models/UserProfileModel";
import { apiRequest } from "../services/apiService";

export const useUserProfile = (token: string | null | undefined) => {
  const [userData, setUserData] = useState<UserProfileModel | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserProfile = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const result = await apiRequest<UserProfileResponseDto>(`UserProfile/Profile`, {
        method: "GET",
        token,
      });

      if (result.success && result.responseData) {
        setUserData(result.responseData);

        // Fetch profile image if user has one
        if (result.responseData.hasProfileImage) {
          try {
            const imageBlob = await apiRequest<Blob>(`UserProfile/Profile/Image`, {
              method: "GET",
              token,
              responseType: "blob",
            });

            // Revoke previous URL to avoid memory leaks
            if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
            setProfileImageUrl(URL.createObjectURL(imageBlob));
          } catch (imgError) {
            console.error("Error fetching profile image:", imgError);
          }
        }
      } else {
        setError(result.message || "Failed to fetch user profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [token]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
    };
  }, [profileImageUrl]);

  return { userData, profileImageUrl, loading, error, refetch: getUserProfile };
};
