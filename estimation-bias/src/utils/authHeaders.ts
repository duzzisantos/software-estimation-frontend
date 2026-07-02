export function getAuthHeaders(): Record<string, string> {
  return {
    "X-API-Key": localStorage.getItem("api_key") ?? "",
    "X-Unlock-Key": localStorage.getItem("unlock_key") ?? "",
  };
}
