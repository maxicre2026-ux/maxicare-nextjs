import { handleUpload } from "@vercel/blob/client";

// This route is used by the client-side `upload` helper to securely
// create blobs in Vercel Blob storage.
export const POST = handleUpload();
