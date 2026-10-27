import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from 'octokit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get authenticated or unauthenticated Octokit instance
function getOctokit(customToken?: string): Octokit {
  const token = customToken || process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    return new Octokit({ auth: token.trim() });
  }
  return new Octokit();
}

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'amoorion-server',
  });
});

// 2. Auth & Git Status
app.get('/api/github/status', (_req: Request, res: Response) => {
  const token = process.env.GITHUB_TOKEN;
  const hasServerToken = Boolean(token && token.trim().length > 0);
  
  res.json({
    hasServerToken,
    user: hasServerToken ? (process.env.GITHUB_USER || 'sarverott (server-env)') : null,
    defaultRepo: 'sarverott/amoorion',
    rateLimitWarning: !hasServerToken ? 'Unauthenticated rate limits apply (60 req/hr). Add GITHUB_TOKEN to .env for 5000 req/hr and direct write permissions.' : null,
  });
});

// 3. Fetch Repository Information (stars, open issues, description, license)
app.get('/api/github/repo', async (req: Request, res: Response) => {
  const owner = (req.query.owner as string) || 'sarverott';
  const repo = (req.query.repo as string) || 'amoorion';
  const userToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');

  try {
    const octokit = getOctokit(userToken);
    const { data } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    res.json({
      name: data.name,
      fullName: data.full_name,
      description: data.description || 'Open-source social communication hub',
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      defaultBranch: data.default_branch,
      topics: data.topics || ['social-web', 'python', 'federation', 'interoperability'],
      htmlUrl: data.html_url,
      updatedAt: data.updated_at,
      pushedAt: data.pushed_at,
    });
  } catch (error: any) {
    console.warn(`[GitHub API] Failed to fetch repo ${owner}/${repo}:`, error?.message);
    // Provide deterministic fallback so UI is always functional
    res.json({
      name: repo,
      fullName: `${owner}/${repo}`,
      description: 'One hub. Many connections. Open-source social communication hub.',
      stars: 42,
      forks: 6,
      openIssues: 3,
      defaultBranch: 'main',
      topics: ['social-web', 'python', 'federation', 'activitypub', 'matrix'],
      htmlUrl: `https://github.com/${owner}/${repo}`,
      fallback: true,
      errorNotice: error?.message || 'Rate limit or network unavailable',
    });
  }
});

// 4. Fetch File Content from Repository
app.get('/api/github/content', async (req: Request, res: Response) => {
  const owner = (req.query.owner as string) || 'sarverott';
  const repo = (req.query.repo as string) || 'amoorion';
  const filePath = (req.query.path as string) || 'content/site-content.json';
  const ref = (req.query.ref as string) || 'main';
  const userToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');

  try {
    const octokit = getOctokit(userToken);
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref,
    });

    if ('content' in data && data.content) {
      const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
      let parsed = null;
      try {
        parsed = JSON.parse(decodedContent);
      } catch {
        // Not JSON (e.g. Markdown or YAML)
      }

      res.json({
        path: data.path,
        sha: data.sha,
        size: data.size,
        content: decodedContent,
        parsed,
        source: 'github-remote',
      });
    } else {
      res.status(404).json({ error: 'File content not found or is a directory' });
    }
  } catch (error: any) {
    // If file does not exist yet in remote repository, return 404 with guidance
    res.status(error?.status || 404).json({
      error: error?.message || 'File not found in repository',
      path: filePath,
      suggestedAction: 'You can initialize and commit this configuration to repository via the Headless CMS Studio.',
    });
  }
});

// 5. Fetch Recent Git Commits
app.get('/api/github/commits', async (req: Request, res: Response) => {
  const owner = (req.query.owner as string) || 'sarverott';
  const repo = (req.query.repo as string) || 'amoorion';
  const userToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');

  try {
    const octokit = getOctokit(userToken);
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 8,
    });

    const commits = data.map((c) => ({
      sha: c.sha.substring(0, 7),
      fullSha: c.sha,
      message: c.commit.message,
      author: {
        name: c.commit.author?.name || 'Contributor',
        email: c.commit.author?.email || '',
        date: c.commit.author?.date || new Date().toISOString(),
      },
      html_url: c.html_url,
    }));

    res.json({ commits, total: commits.length });
  } catch (error: any) {
    console.warn(`[GitHub API] Failed to fetch commits for ${owner}/${repo}:`, error?.message);
    // Provide illustrative fallback commit history
    res.json({
      commits: [
        {
          sha: 'b84f29a',
          fullSha: 'b84f29ae4872910d65b1285cb1d0f5e1f7051280',
          message: 'chore: initial protocol routing foundation and configuration',
          author: { name: 'sarverott', email: 'sarverott@gmail.com', date: '2026-10-25T14:20:00Z' },
          html_url: `https://github.com/${owner}/${repo}/commit/b84f29a`,
        },
        {
          sha: '4d193fa',
          fullSha: '4d193fa88d12093ea6518cb1d0f5e1f7051281',
          message: 'docs: update readthedocs guides and architecture diagrams',
          author: { name: 'sarverott', email: 'sarverott@gmail.com', date: '2026-10-22T09:12:00Z' },
          html_url: `https://github.com/${owner}/${repo}/commit/4d193fa`,
        },
        {
          sha: '9ec0128',
          fullSha: '9ec01287c2b309110d65b1285cb1d0f5e1f70512',
          message: 'feat: add headless CMS configuration schema for website',
          author: { name: 'amoorion-bot', email: 'bot@amoorion.org', date: '2026-10-20T17:45:00Z' },
          html_url: `https://github.com/${owner}/${repo}/commit/9ec0128`,
        },
      ],
      total: 3,
      fallback: true,
      errorNotice: error?.message || 'Unauthenticated rate limit',
    });
  }
});

// 6. Commit and Push Content directly to GitHub repository
app.post('/api/github/commit', async (req: Request, res: Response) => {
  const {
    owner = 'sarverott',
    repo = 'amoorion',
    path: filePath = 'content/site-content.json',
    branch = 'main',
    message,
    content,
    sha,
  } = req.body;

  const userToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const activeToken = userToken || process.env.GITHUB_TOKEN;

  if (!activeToken || activeToken.trim().length === 0) {
    return res.status(401).json({
      error: 'GitHub Token required for write operations',
      details: 'Configure GITHUB_TOKEN in your environment or enter your Personal Access Token in the CMS settings.',
    });
  }

  if (!content) {
    return res.status(400).json({ error: 'Content payload is required for commit' });
  }

  try {
    const octokit = getOctokit(activeToken);
    
    // Prepare base64 string
    const stringContent = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);
    const contentBase64 = Buffer.from(stringContent).toString('base64');

    // If SHA was not provided, attempt to look it up so we update cleanly without conflicts
    let existingSha = sha;
    if (!existingSha) {
      try {
        const existing = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: branch,
        });
        if ('sha' in existing.data) {
          existingSha = existing.data.sha;
        }
      } catch {
        // File does not exist yet, will be newly created
      }
    }

    const commitMessage = message || `Update ${filePath} via Amoorion Headless CMS`;

    const { data } = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: commitMessage,
      content: contentBase64,
      branch,
      ...(existingSha ? { sha: existingSha } : {}),
      committer: {
        name: 'Amoorion CMS Bot',
        email: 'cms@amoorion.org',
      },
      author: {
        name: 'Amoorion Content Manager',
        email: 'cms@amoorion.org',
      },
    });

    res.json({
      success: true,
      commitSha: data.commit.sha,
      commitUrl: data.commit.html_url,
      contentSha: data.content?.sha,
      message: commitMessage,
      branch,
    });
  } catch (error: any) {
    console.error(`[GitHub API] Failed to commit to ${owner}/${repo}:`, error);
    res.status(error?.status || 500).json({
      error: error?.message || 'Failed to commit to GitHub repository',
      status: error?.status,
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Amoorion Server] Running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Amoorion Server] Error starting server:', err);
  process.exit(1);
});
