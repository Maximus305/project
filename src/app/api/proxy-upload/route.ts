import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const contentType = req.headers['content-type'];
  if (!contentType?.includes('multipart/form-data')) {
    return res.status(400).json({ error: 'Invalid content type. Expected multipart/form-data.' });
  }

  try {
    const response = await axios.post(
      'https://pdf2llm-d4y3d99yh-maximus305s-projects.vercel.app/api/upload',
      req,
      {
        headers: {
          ...req.headers,
          'Content-Type': contentType,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'An error occurred while proxying the request.' });
  }
}