import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { data } = await axios.get('https://www.miet.ru/schedule/groups', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://www.miet.ru/',
      },
      timeout: 10000,
    })

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'MIET_GROUPS_FAILED' })
  }
}
