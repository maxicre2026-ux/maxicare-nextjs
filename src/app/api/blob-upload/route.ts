import { handleUpload } from "@vercel/blob/client";

// Route handler used by the client-side `upload` helper to securely
// create blobs in Vercel Blob storage.
// The token is provided via the BLOB_READ_WRITE_TOKEN environment variable.
export const POST = handleUpload({
  token: process.env.BLOB_READ_WRITE_TOKEN,
});
