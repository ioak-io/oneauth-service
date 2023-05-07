import fs from "fs";
import jwt from "jsonwebtoken";

export const decodeToken = async (token: string) => {
    const appRoot = process.cwd();
    const publicKey = fs.readFileSync(appRoot + "/public.pem");
    console.log(publicKey);
    try {
        const res = await jwt.verify(token, publicKey);
        return { outcome: true, token, claims: res };
    } catch (err) {
        console.log(err);
        return { outcome: false, err };
    }
};