/**
 * Cloudinary URL Optimization Utility
 * Automatically injects f_auto,q_auto transformations for next-gen formats (AVIF/WebP) and intelligent compression.
 */
export function optimizeCloudinaryUrl(
  url: string | null | undefined,
  transformations: string = "f_auto,q_auto"
): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;
  
  // If already contains f_auto or q_auto, don't duplicate
  if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto") || url.includes(`/upload/${transformations}/`)) {
    return url;
  }

  // Insert transformations right after /upload/
  return url.replace("/upload/", `/upload/${transformations}/`);
}
