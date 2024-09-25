// pages/api/login.ts (TypeScript) or login.js (JavaScript)
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    console.log(req.headers.authtoken);

    try {
      const response = await axios.get(
        "https://iras.iub.edu.bd:8079//api/v1/registration/2110182/all-offer-courses",
        {
          headers: {
            "Content-Type": "application/json",
            Origin: "https://irasv1.iub.edu.bd",
            Referer: "https://irasv1.iub.edu.bd/",
            Authorization: `Bearer ${req.headers.authtoken}`,
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
