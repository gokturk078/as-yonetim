import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "feritabi";
const REPO_NAME = process.env.GITHUB_REPO_NAME || "f2s-system";

// Simple In-Memory Cache and Request Deduplication
const CACHE_TTL = 60 * 1000; // 60 seconds
const fileCache = new Map<string, { content: any; sha: string; timestamp: number }>();
const pendingRequests = new Map<string, Promise<{ content: any; sha: string | null }>>();

export async function getFileContent(path: string) {
  // 1. Check Cache
  const cached = fileCache.get(path);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { content: cached.content, sha: cached.sha };
  }

  // 2. Check Pending Requests (Deduplication)
  if (pendingRequests.has(path)) {
    return pendingRequests.get(path)!;
  }

  // 3. Create Request Promise
  const requestPromise = (async () => {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path,
      });

      if (Array.isArray(data) || !('content' in data)) {
        throw new Error("Target is a directory or invalid response");
      }

      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const parsedContent = JSON.parse(content);

      // Update Cache
      fileCache.set(path, {
        content: parsedContent,
        sha: data.sha,
        timestamp: Date.now()
      });

      return {
        content: parsedContent,
        sha: data.sha,
      };
    } catch (error: any) {
      if (error.status === 404) {
        return { content: null, sha: null };
      }
      throw error;
    } finally {
      // Cleanup pending request
      pendingRequests.delete(path);
    }
  })();

  pendingRequests.set(path, requestPromise);
  return requestPromise;
}

// Helper for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function updateFileContent(path: string, content: any, sha: string | null, message: string, retries = 3) {
  const contentEncoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");

  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message,
      content: contentEncoded,
      sha: sha || undefined,
    });

    // Invalidate Cache
    fileCache.delete(path);
  } catch (error: any) {
    // 409 Conflict Handling or 403 Rate Limit
    if (retries > 0) {
      if (error.status === 409) {
        console.warn(`Conflict detected for ${path}. Retrying...`);
        // In a real app, we should fetch fresh SHA here before retry
        const fresh = await getFileContent(path);
        return updateFileContent(path, content, fresh.sha, message, retries - 1);
      }
      if (error.status === 403) { // Rate limit
        console.warn(`Rate limit hit. Waiting...`);
        await delay(1000); // Reduced delay to fail faster
        return updateFileContent(path, content, sha, message, retries - 1);
      }
    }
    throw error;
  }
}
