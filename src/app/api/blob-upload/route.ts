import { handleUpload } from "@vercel/blob/client";

// This route is used by the client-side `upload` helper to securely
// create blobs in Vercel Blob storage.
// We don't need any special logic here, but `handleUpload` expects
// an options object, so we pass an empty one.
export const POST = handleUpload({});
