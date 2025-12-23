import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// Route handler used by the client-side `upload` helper to securely
// create blobs in Vercel Blob storage via the client `upload()` helper.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  return handleUpload({
    request,
    body,
    // نقدر نضيف منطق إضافي هنا (مثلاً ربط الملف باليوزر) لو حابب بعدين
    onBeforeGenerateToken: async () => ({
      tokenPayload: JSON.stringify({}),
    }),
  });
}
