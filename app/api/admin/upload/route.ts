import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  // TODO(auth): once /admin has auth wired up, verify the session/token here
  // before allowing an upload. Right now this route is reachable by anyone
  // who finds the URL — do not treat this as production-ready until that's in.

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 8MB)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "glasskid-projects",
          resource_type: "image",
          // auto-optimizes format/quality on delivery (matches the
          // next-cloudinary CldImage default behavior)
          transformation: [{ fetch_format: "auto", quality: "auto" }],
        },
        (error: UploadApiErrorResponse | undefined, result?: UploadApiResponse) => {
          if (error || !result) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}