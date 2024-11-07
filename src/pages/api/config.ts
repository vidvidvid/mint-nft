import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  alchemyEndpoint: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    alchemyEndpoint: process.env.ALCHEMY_ENDPOINT || "",
  });
}
