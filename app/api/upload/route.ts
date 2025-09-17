import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ cloud_name:'db4luazyu', api_key:'664538238465641', api_secret:'QTDvkF8gAumubVviVcFMBdaGoOs', });

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const imageFile = data.get("file");
    console.log('imageFile',imageFile);

    if (!imageFile || !(imageFile instanceof Blob)) {
      return NextResponse.json({ error: "No se subió ningún archivo válido" }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "nextjs_uploads" }, (error, result) => {
        console.log('resultado',result);
        if (error) return reject(error);
        resolve(result);
      }).end(buffer);
    });
    
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 });
  }
}
