// pages/api/login.ts (TypeScript) or login.js (JavaScript)
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Forward the request to the external API
      const response = await axios.post(
        "https://iras.iub.edu.bd:8079/v3/account/token",
        req.body, // Pass the body received from the client
        {
          headers: {
            "Content-Type": "application/json",
            Origin: "https://irasv1.iub.edu.bd", // Custom Origin
            Referer: "https://irasv1.iub.edu.bd/", // Custom Referer
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
