import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Standard OpenAPI 3.1.0 specification for Amoorion v0.4.33 Daemon & HTTP REST API
const AMOORION_OPENAPI_SPEC = {
  openapi: '3.1.0',
  info: {
    title: 'Amoorion Universal Communication API',
    version: '0.4.33',
    description:
      'Universal tool for administration of chatting and communication platforms: publish, read and reply on many platforms from one HTTP API, CLI, or MCP server.',
    contact: {
      name: 'Sett Sarverott & Amoorion Contributors',
      url: 'https://github.com/Sarverott/amoorion',
    },
    license: {
      name: 'MIT / Apache-2.0',
      url: 'https://github.com/Sarverott/amoorion/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Local Amoorion Daemon Server',
    },
    {
      url: 'https://api.amoorion.net/v1',
      description: 'Federated Gateway (Mock/Staging)',
    },
  ],
  tags: [
    { name: 'Publish', description: 'Cross-platform broadcast and publication' },
    { name: 'Inbox', description: 'Unified multi-platform messaging stream' },
    { name: 'Platforms', description: 'Connected social protocols and driver status' },
    { name: 'Vault', description: 'Secure credential storage (KeePassXC / Bitwarden)' },
    { name: 'Daemon', description: 'Background service and event loop control' },
    { name: 'MCP', description: 'Model Context Protocol tool endpoints for AI agents' },
  ],
  paths: {
    '/api/v1/publish': {
      post: {
        tags: ['Publish'],
        summary: 'Broadcast a post across platforms',
        description: 'Post text and attachments to selected platforms or all configured channels.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: {
                    type: 'string',
                    example: 'Hello open social web! One heart, many connections.',
                  },
                  platforms: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['bluesky', 'mastodon', 'matrix'],
                  },
                  media_urls: {
                    type: 'array',
                    items: { type: 'string', format: 'uri' },
                    example: [],
                  },
                  dry_run: {
                    type: 'boolean',
                    default: false,
                    description: 'Simulate without posting to live platform accounts',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Broadcast results per platform',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    published_to: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          platform: { type: 'string' },
                          post_id: { type: 'string' },
                          url: { type: 'string' },
                        },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/inbox': {
      get: {
        tags: ['Inbox'],
        summary: 'Retrieve unified incoming messages',
        description: 'Fetch aggregated messages across Bluesky, Telegram, Discord, Matrix, etc.',
        parameters: [
          {
            name: 'unread_only',
            in: 'query',
            schema: { type: 'boolean', default: false },
          },
          {
            name: 'platform',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          '200': {
            description: 'List of messages from the unified inbox',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    count: { type: 'integer' },
                    messages: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          platform: { type: 'string' },
                          sender: { type: 'string' },
                          content: { type: 'string' },
                          received_at: { type: 'string', format: 'date-time' },
                          is_read: { type: 'boolean' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/platforms': {
      get: {
        tags: ['Platforms'],
        summary: 'List available and active platform plugins',
        description: 'Returns all loaded driver plugins and their connection health.',
        responses: {
          '200': {
            description: 'Active platform driver specifications',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    version: { type: 'string', example: '0.4.33' },
                    plugins: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          type: { type: 'string', enum: ['publication', 'communication', 'bridge'] },
                          version: { type: 'string' },
                          connected: { type: 'boolean' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/vault/status': {
      get: {
        tags: ['Vault'],
        summary: 'Inspect credentials vault status',
        description: 'Check KeePassXC or Bitwarden vault state and configured credentials.',
        responses: {
          '200': {
            description: 'Vault health check',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    backend: { type: 'string', example: 'keepassxc' },
                    unlocked: { type: 'boolean', example: true },
                    platforms_configured: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['bluesky', 'mastodon', 'matrix', 'discord', 'telegram'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/mcp/tools': {
      get: {
        tags: ['MCP'],
        summary: 'List Model Context Protocol tools for AI agents',
        description: 'Exposes Amoorion functions to Anthropic Claude, Codex, Gemini, and MCP clients.',
        responses: {
          '200': {
            description: 'Available MCP tools',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tools: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          description: { type: 'string' },
                          inputSchema: { type: 'object' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/daemon/status': {
      get: {
        tags: ['Daemon'],
        summary: 'Get daemon process status',
        responses: {
          '200': {
            description: 'Daemon uptime and active tasks',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    running: { type: 'boolean', example: true },
                    version: { type: 'string', example: '0.4.33' },
                    uptime_seconds: { type: 'number' },
                    nats_connected: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '0.4.33',
    timestamp: new Date().toISOString(),
    service: 'amoorion-website-backend',
  });
});

// 2. Standard OpenAPI specification endpoint
app.get('/api/openapi/spec', (_req: Request, res: Response) => {
  res.json(AMOORION_OPENAPI_SPEC);
});

// 3. Proxy & load OpenAPI specification from any remote URL (decoupled architecture)
app.get('/api/openapi/proxy', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.json(AMOORION_OPENAPI_SPEC);
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json, text/yaml, text/plain, */*',
        'User-Agent': 'Amoorion-Web-Setup-Loader/0.4.33',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Remote server responded with ${response.status}: ${response.statusText}`,
        url: targetUrl,
      });
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('json') || targetUrl.endsWith('.json')) {
      const data = await response.json();
      return res.json({ spec: data, source: targetUrl, format: 'json' });
    } else {
      const text = await response.text();
      return res.json({ raw: text, source: targetUrl, format: 'yaml_or_text' });
    }
  } catch (error: any) {
    res.status(502).json({
      error: 'Failed to fetch remote OpenAPI specification',
      message: error?.message || 'Network error',
      url: targetUrl,
    });
  }
});

// 4. Load setups & manifests from external endpoints (e.g., sarverott.github.io/amoorion/manifest.json)
app.get('/api/setup/load', async (req: Request, res: Response) => {
  const targetUrl = (req.query.url as string) || 'https://sarverott.github.io/amoorion/manifest.json';

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Amoorion-Web-Setup-Loader/0.4.33',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return res.json({
        success: true,
        source: targetUrl,
        data,
      });
    }

    res.status(response.status).json({
      error: `Could not load setup from ${targetUrl}`,
      status: response.status,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Error loading external setup',
      message: error?.message,
      url: targetUrl,
    });
  }
});

// 5. Proxy site manifest
app.get('/api/manifest', async (_req: Request, res: Response) => {
  try {
    const resRemote = await fetch('https://sarverott.github.io/amoorion/manifest.json');
    if (resRemote.ok) {
      const data = await resRemote.json();
      return res.json(data);
    }
  } catch (err) {
    console.warn('Could not fetch remote manifest.json:', err);
  }

  // Fallback manifest matching v0.4.33
  res.json({
    name: 'amoorion',
    version: '0.4.33',
    repository: 'https://github.com/Sarverott/amoorion',
    docs: 'https://amoorion.readthedocs.io/',
    packages: {
      amoorion: '0.4.33',
      'amoorion-blogger': '0.4.4',
      'amoorion-bluesky': '0.4.5',
      'amoorion-discord': '0.4.5',
      'amoorion-email': '0.4.10',
      'amoorion-facebook': '0.4.4',
      'amoorion-mastodon': '0.4.6',
      'amoorion-matrix': '0.4.5',
      'amoorion-ntfy': '0.4.8',
      'amoorion-telegram': '0.4.5',
      'amoorion-tumblr': '0.4.5',
      'amoorion-x': '0.4.6',
    },
    pages: ['project.html', 'releases.html', 'examples/index.html', 'index.html'],
  });
});

// 6. Repository stats proxy
app.get('/api/github/repo', async (req: Request, res: Response) => {
  const owner = (req.query.owner as string) || 'sarverott';
  const repo = (req.query.repo as string) || 'amoorion';

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Amoorion-Website/0.4.33',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (response.ok) {
      const data = await response.json();
      return res.json({
        name: data.name,
        fullName: data.full_name,
        description: data.description || 'Universal tool for administration of chatting and communication platforms',
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        defaultBranch: data.default_branch,
        htmlUrl: data.html_url,
        version: '0.4.33',
      });
    }
  } catch (error: any) {
    console.warn(`[GitHub Repo Fetch] Warning:`, error?.message);
  }

  // Graceful fallback
  res.json({
    name: repo,
    fullName: `${owner}/${repo}`,
    description: 'Universal tool for administration of chatting and communication platforms: v0.4.33',
    stars: 1,
    forks: 0,
    openIssues: 0,
    defaultBranch: 'master',
    htmlUrl: `https://github.com/${owner}/${repo}`,
    version: '0.4.33',
    fallback: true,
  });
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
    console.log(`[Amoorion Server] Running on http://0.0.0.0:${PORT} (v0.4.33)`);
  });
}

startServer().catch((err) => {
  console.error('[Amoorion Server] Error starting server:', err);
  process.exit(1);
});
