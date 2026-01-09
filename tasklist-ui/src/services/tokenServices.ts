export const tokenService = {
    
  setTokens: (accessToken: string, refreshToken: string) => {
    sessionStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  },

  getAccessToken: () => sessionStorage.getItem("access_token"),

  getRefreshToken: () => localStorage.getItem("refresh_token"),

  clearTokens: () => {
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};
