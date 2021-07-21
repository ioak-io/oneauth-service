import { Client } from "minio";
import { createSequence, nextval } from "../sequence/service";

export const generateRealmNumber = async () => {
  let realm = await nextval({ field: "realm" });
  if (!realm) {
    await createSequence({ field: "realm", factor: 1, nextval: 220 });
    realm = await generateRealmNumber();
  }
  return realm;
};

export const processFileUpload = async (
  base64: any,
  dir: string,
  file: string
) => {
  const minioClient = new Client({
    endPoint: "localhost",
    port: 9000,
    accessKey: "123",
    secretKey: "123456789",
    useSSL: false,
  });
  const out = await minioClient.putObject(
    "oneauth",
    `${dir}/${file}.png`,
    base64ToBuffer(base64),
    undefined,
    {
      "Content-Type": "image/png",
    }
  );
  const fileUrl = `http://localhost:9000/oneauth/${dir}/${file}.png`;
  return fileUrl;
};

const base64ToBuffer = (base64: any) => {
  return (Buffer as any).from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
};
