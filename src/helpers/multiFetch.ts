interface UrlResponse {
  url: string;
  data?: any;
  error?: string;
}

async function fetchUrl(url: string): Promise<UrlResponse> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed for ${url}. Status: ${response.status}`);
    }
    const data = await response.json();
    return { url, data };
  } catch (error: any) {
    return { url, error: error.message };
  }
}

export default async function multiFetch(urls: string[], MAX_CONCURRENCY: number = 3): Promise<UrlResponse[]> {
  const responses: UrlResponse[] = [];

  const fetchQueue: Promise<UrlResponse>[] = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    const fetchPromise = fetchUrl(url);
    fetchQueue.push(fetchPromise);

    if (fetchQueue.length >= MAX_CONCURRENCY || i === urls.length - 1) {
      const chunkResponses = await Promise.all(fetchQueue);
      responses.push(...chunkResponses);
      fetchQueue.length = 0; // Clear the fetch queue
    }
  }

  return responses;
}
