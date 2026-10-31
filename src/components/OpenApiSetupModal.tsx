import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  FileCode,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Code2,
  Terminal,
  Layers,
  ArrowRight,
  BookOpen,
  Copy,
  Check,
  Server,
  Zap,
} from 'lucide-react';
import { SiteContent, SupportedLanguage, SubpageLink } from '../types/content';
import { validateContentSchema, mergeContentWithDefaults } from '../utils/content-parser';

interface OpenApiSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: SiteContent;
  onSaveContent: (updated: SiteContent) => void;
  currentLang: SupportedLanguage;
}

export const OpenApiSetupModal: React.FC<OpenApiSetupModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onSaveContent,
}) => {
  const [activeTab, setActiveTab] = useState<'openapi' | 'loader' | 'subpages' | 'raw'>('openapi');
  const [openApiSpec, setOpenApiSpec] = useState<any>(null);
  const [specUrl, setSpecUrl] = useState<string>('/api/openapi/spec');
  const [customSpecUrl, setCustomSpecUrl] = useState<string>('');
  const [setupUrl, setSetupUrl] = useState<string>('https://sarverott.github.io/amoorion/manifest.json');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>('/api/v1/publish');
  const [generatedPayload, setGeneratedPayload] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(currentContent, null, 2));

  // Load standard OpenAPI spec on open
  useEffect(() => {
    if (isOpen) {
      loadOpenApiSpec('/api/openapi/spec');
      setJsonText(JSON.stringify(currentContent, null, 2));
    }
  }, [isOpen]);

  const loadOpenApiSpec = async (url: string) => {
    setIsLoading(true);
    try {
      const endpoint = url === '/api/openapi/spec' ? '/api/openapi/spec' : `/api/openapi/proxy?url=${encodeURIComponent(url)}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        const spec = data.spec || data;
        setOpenApiSpec(spec);
        setSpecUrl(url);
        setNotification({
          type: 'success',
          message: `Loaded OpenAPI ${spec.openapi || '3.1.0'} specification for ${spec.info?.title || 'API'} (v${spec.info?.version || '0.4.33'})`,
        });
      } else {
        throw new Error(`Server returned ${res.status}`);
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Failed to load OpenAPI spec: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadExternalSetup = async (targetUrl: string) => {
    setIsLoading(true);
    setNotification({ type: 'info', message: `Loading setup from ${targetUrl}...` });

    try {
      const res = await fetch(`/api/setup/load?url=${encodeURIComponent(targetUrl)}`);
      if (res.ok) {
        const resData = await res.json();
        const externalData = resData.data;

        // If it's the site manifest, integrate package versions and pages
        if (externalData.packages && externalData.version) {
          const updated: SiteContent = {
            ...currentContent,
            version: externalData.version,
            hero: {
              ...currentContent.hero,
              versionBadge: `v${externalData.version}`,
            },
            openApiConfig: {
              ...currentContent.openApiConfig,
              setupSourceUrl: targetUrl,
            },
          };
          onSaveContent(updated);
          setJsonText(JSON.stringify(updated, null, 2));
          setNotification({
            type: 'success',
            message: `Successfully loaded setup from external project repository! Version: ${externalData.version}, ${Object.keys(externalData.packages).length} packages detected.`,
          });
        } else {
          // Standard site content schema
          const merged = mergeContentWithDefaults(externalData, currentContent);
          onSaveContent(merged);
          setJsonText(JSON.stringify(merged, null, 2));
          setNotification({
            type: 'success',
            message: `External setup configuration loaded and applied to live site!`,
          });
        }
      } else {
        throw new Error(`Failed to load external setup: HTTP ${res.status}`);
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Setup load failed: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const merged = mergeContentWithDefaults(parsed, currentContent);
        onSaveContent(merged);
        setJsonText(JSON.stringify(merged, null, 2));
        setNotification({
          type: 'success',
          message: `Loaded custom configuration from ${file.name}!`,
        });
      } catch (err) {
        setNotification({
          type: 'error',
          message: 'Invalid JSON file format',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCopyPayload = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  if (!isOpen) return null;

  const paths = openApiSpec?.paths || {};
  const currentPathObj = selectedEndpoint && paths[selectedEndpoint] ? paths[selectedEndpoint] : null;
  const currentMethod = currentPathObj ? Object.keys(currentPathObj)[0] : 'get';
  const currentOperation = currentPathObj ? currentPathObj[currentMethod] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0c0f18] border border-rose-800/60 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#090b13] border-b border-rose-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-950 flex items-center justify-center shadow-[0_0_15px_rgba(225,76,98,0.4)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif text-[#fbf6f3]">
                  Amoorion OpenAPI & Remote Setup Studio
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 border border-rose-700/50 text-rose-300 font-mono">
                  v0.4.33
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 font-mono">
                  Detached Architecture
                </span>
              </div>
              <p className="text-xs text-rose-300/60">
                Load setups and inspect standard OpenAPI specifications from external repositories and endpoints.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#131622] hover:bg-rose-950 text-rose-300 hover:text-white transition-colors"
            aria-label="Close Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detached Repositories Notice Banner */}
        <div className="px-6 py-2 bg-[#121624] border-b border-rose-950/50 flex flex-wrap items-center justify-between text-xs text-rose-200/90 gap-2">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-rose-100">
              <strong>Architecture:</strong> Main product (<code className="text-rose-300 font-mono">sarverott/amoorion</code>) &amp; website are two separate repositories.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400">Spec endpoint:</span>
            <span className="text-[11px] font-mono text-rose-300 bg-[#090b12] px-2 py-0.5 rounded border border-rose-900/40">
              {specUrl}
            </span>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            className={`px-6 py-2 text-xs flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-950/60 text-emerald-200 border-b border-emerald-900/40'
                : notification.type === 'error'
                ? 'bg-rose-950/60 text-rose-200 border-b border-rose-900/40'
                : 'bg-indigo-950/60 text-indigo-200 border-b border-indigo-900/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {notification.type === 'info' && <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-3 bg-[#0a0d16] border-b border-rose-950/50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('openapi')}
              className={`px-4 py-2 text-xs font-medium rounded-t-xl transition-colors border-t border-x ${
                activeTab === 'openapi'
                  ? 'bg-[#0c0f18] text-rose-200 border-rose-800/60 font-semibold'
                  : 'text-gray-400 border-transparent hover:text-rose-300'
              }`}
            >
              OpenAPI Explorer (v3.1.0)
            </button>
            <button
              onClick={() => setActiveTab('loader')}
              className={`px-4 py-2 text-xs font-medium rounded-t-xl transition-colors border-t border-x ${
                activeTab === 'loader'
                  ? 'bg-[#0c0f18] text-rose-200 border-rose-800/60 font-semibold'
                  : 'text-gray-400 border-transparent hover:text-rose-300'
              }`}
            >
              Remote Setup Loader
            </button>
            <button
              onClick={() => setActiveTab('subpages')}
              className={`px-4 py-2 text-xs font-medium rounded-t-xl transition-colors border-t border-x ${
                activeTab === 'subpages'
                  ? 'bg-[#0c0f18] text-rose-200 border-rose-800/60 font-semibold'
                  : 'text-gray-400 border-transparent hover:text-rose-300'
              }`}
            >
              Linked Subpages &amp; Manifest
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-4 py-2 text-xs font-medium rounded-t-xl transition-colors border-t border-x ${
                activeTab === 'raw'
                  ? 'bg-[#0c0f18] text-rose-200 border-rose-800/60 font-semibold'
                  : 'text-gray-400 border-transparent hover:text-rose-300'
              }`}
            >
              Raw Schema
            </button>
          </div>

          <a
            href="https://sarverott.github.io/amoorion/project.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 mb-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 text-rose-200 text-xs font-medium transition-colors"
          >
            <span>Open project.html</span>
            <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
          </a>
        </div>

        {/* TAB 1: OpenAPI Explorer */}
        {activeTab === 'openapi' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Custom URL loader bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl bg-[#101422] border border-rose-900/40">
              <span className="text-xs text-rose-300 font-mono shrink-0">OpenAPI Spec URL:</span>
              <input
                type="text"
                placeholder="e.g. /api/openapi/spec or https://..."
                value={customSpecUrl}
                onChange={(e) => setCustomSpecUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#090b12] border border-rose-950 text-xs font-mono text-rose-100 focus:outline-none focus:border-rose-400"
              />
              <button
                onClick={() => loadOpenApiSpec(customSpecUrl.trim() || '/api/openapi/spec')}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Fetch Spec</span>
              </button>
            </div>

            {/* Endpoints & Details Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Endpoint List */}
              <div className="lg:col-span-5 space-y-2">
                <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                  API Routes ({Object.keys(paths).length})
                </h4>
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {Object.entries(paths).map(([p, methods]: [string, any]) => {
                    const method = Object.keys(methods)[0];
                    const op = methods[method];
                    const isSelected = selectedEndpoint === p;

                    return (
                      <button
                        key={p}
                        onClick={() => setSelectedEndpoint(p)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-950/70 border-rose-500 text-white shadow-[0_0_15px_rgba(225,76,98,0.25)]'
                            : 'bg-[#101320] border-rose-950/60 text-gray-300 hover:bg-[#141828] hover:border-rose-800/50'
                        }`}
                      >
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                                method === 'post'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                                  : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                              }`}
                            >
                              {method}
                            </span>
                            <span className="font-mono text-xs truncate text-rose-100">{p}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate">{op.summary}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-2" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Endpoint Inspector & Interactive Tester */}
              <div className="lg:col-span-7">
                {currentOperation ? (
                  <div className="p-5 rounded-2xl bg-[#090b12] border border-rose-900/50 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                              currentMethod === 'post'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                                : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                            }`}
                          >
                            {currentMethod}
                          </span>
                          <span className="font-mono text-sm font-semibold text-rose-100">
                            {selectedEndpoint}
                          </span>
                        </div>
                        <p className="text-xs text-rose-300/80">{currentOperation.description || currentOperation.summary}</p>
                      </div>
                    </div>

                    {/* Request Schema Sample */}
                    {currentOperation.requestBody && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-rose-300">
                          <span className="font-semibold uppercase tracking-wider text-[11px]">Request Body Schema:</span>
                          <button
                            onClick={() => {
                              const sample = JSON.stringify(
                                currentOperation.requestBody.content?.['application/json']?.schema?.properties || {},
                                null,
                                2
                              );
                              handleCopyPayload(sample);
                            }}
                            className="text-[11px] text-rose-400 hover:text-white flex items-center gap-1"
                          >
                            {copiedPayload ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedPayload ? 'Copied' : 'Copy Sample'}</span>
                          </button>
                        </div>
                        <pre className="p-3 rounded-xl bg-[#0e121d] border border-rose-950/70 text-xs font-mono text-rose-200 overflow-x-auto max-h-40">
                          {JSON.stringify(
                            currentOperation.requestBody.content?.['application/json']?.schema?.properties || {},
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}

                    {/* Responses */}
                    <div className="space-y-2">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-rose-300">
                        Expected Responses:
                      </span>
                      <div className="p-3 rounded-xl bg-[#0e121d] border border-rose-950/70 text-xs font-mono text-rose-200">
                        <div className="text-emerald-400 font-semibold">200 OK:</div>
                        <div className="text-[11px] text-gray-300 mt-1">
                          {currentOperation.responses?.['200']?.description || 'Success'}
                        </div>
                      </div>
                    </div>

                    {/* cURL Generator */}
                    <div className="pt-2">
                      <span className="text-[11px] font-mono text-gray-400 block mb-1">Generated cURL command:</span>
                      <div className="p-2.5 rounded-lg bg-[#07090e] border border-rose-950 text-xs font-mono text-rose-200 flex items-center justify-between overflow-x-auto">
                        <code className="truncate pr-2">
                          curl -X {currentMethod.toUpperCase()} "http://localhost:8080{selectedEndpoint}"
                          {currentMethod === 'post' ? ' -H "Content-Type: application/json" -d \'{"message":"Hello"}\'' : ''}
                        </code>
                        <button
                          onClick={() =>
                            handleCopyPayload(
                              `curl -X ${currentMethod.toUpperCase()} "http://localhost:8080${selectedEndpoint}"${
                                currentMethod === 'post'
                                  ? ' -H "Content-Type: application/json" -d \'{"message":"Hello"}\''
                                  : ''
                              }`
                            )
                          }
                          className="p-1 rounded hover:bg-rose-950/60 text-rose-400 shrink-0"
                          title="Copy cURL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-gray-400">Select an API route to inspect</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Remote Setup Loader */}
        {activeTab === 'loader' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-[#101422] border border-rose-900/40 space-y-3">
              <h4 className="text-xs font-semibold text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-rose-400" />
                <span>Load Setups From External Repositories or Endpoints</span>
              </h4>
              <p className="text-xs text-rose-300/70">
                Because <code className="text-rose-200">amoorion</code> and <code className="text-rose-200">amoorion-website</code> are separate repos, configurations and manifests can be fetched dynamically over HTTP/JSON.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                <input
                  type="text"
                  value={setupUrl}
                  onChange={(e) => setSetupUrl(e.target.value)}
                  placeholder="https://sarverott.github.io/amoorion/manifest.json"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#090b12] border border-rose-950 text-xs font-mono text-rose-100 focus:outline-none focus:border-rose-400"
                />
                <button
                  onClick={() => handleLoadExternalSetup(setupUrl)}
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-medium transition-all shadow shrink-0 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Load &amp; Apply Setup</span>
                </button>
              </div>
            </div>

            {/* Setup Presets */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                Quick Setup Presets:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSetupUrl('https://sarverott.github.io/amoorion/manifest.json');
                    handleLoadExternalSetup('https://sarverott.github.io/amoorion/manifest.json');
                  }}
                  className="p-3.5 text-left rounded-xl bg-[#0d101a] border border-rose-950 hover:border-rose-400/70 hover:bg-[#121625] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-100 group-hover:text-white">
                      Amoorion Official Manifest (v0.4.33)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">Live</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Directly loads the verified packages matrix and subpage index from github-pages.
                  </p>
                </button>

                <label className="p-3.5 text-left rounded-xl bg-[#0d101a] border border-rose-950 hover:border-rose-400/70 hover:bg-[#121625] transition-all group cursor-pointer block">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-100 group-hover:text-white">
                      Upload Custom JSON Setup
                    </span>
                    <Upload className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Import setup or site-content configuration from your local file system.
                  </p>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Currently Active Packages Family from v0.4.33 */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                Loaded Package Matrix (v0.4.33):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {currentContent.packages.map((pkg) => (
                  <div key={pkg.name} className="p-2.5 rounded-lg bg-[#090b12] border border-rose-950 text-xs">
                    <div className="font-mono text-rose-200 font-semibold">{pkg.name}</div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
                      <span className="text-rose-400 font-mono">v{pkg.version}</span>
                      <span className="capitalize text-[10px] text-gray-500">{pkg.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Linked Subpages & Manifest */}
        {activeTab === 'subpages' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                Direct Links to Official Documentation &amp; Subpages
              </h4>
              <p className="text-xs text-rose-300/70 mb-4">
                These pages are assembled by the main project and hosted on GitHub Pages:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentContent.subpages.map((sp) => (
                <a
                  key={sp.url}
                  href={sp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#0f121d] border border-rose-900/40 hover:border-rose-400/70 hover:bg-[#141828] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-rose-100 group-hover:text-white">
                        {sp.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-xs text-rose-300/70 leading-relaxed font-light">
                      {sp.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-rose-950/60 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span className="truncate max-w-[240px]">{sp.url}</span>
                    <span className="text-rose-400 group-hover:underline">Open →</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Featured Interactive Marimo Notebooks */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                  Featured Interactive Marimo Notebooks (20+ Examples):
                </h4>
                <a
                  href="https://sarverott.github.io/amoorion/examples/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-rose-400 hover:text-white flex items-center gap-1"
                >
                  <span>View All Examples</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentContent.featuredExamples.map((ex) => (
                  <a
                    key={ex.id}
                    href={ex.htmlPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#090b12] border border-rose-950 hover:border-rose-500/60 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">
                          #{ex.id} {ex.badge}
                        </span>
                        <ExternalLink className="w-3 h-3 text-rose-400" />
                      </div>
                      <div className="text-xs font-semibold text-rose-100 group-hover:text-white">
                        {ex.title}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-normal line-clamp-2">
                        {ex.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Raw Schema */}
        {activeTab === 'raw' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-300 font-mono">
                Active Site &amp; Setup Configuration (JSON)
              </span>
              <button
                onClick={() => {
                  const blob = new Blob([jsonText], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'amoorion-setup.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="text-xs text-rose-400 hover:text-white flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Setup JSON</span>
              </button>
            </div>
            <textarea
              rows={16}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#080a12] border border-rose-900/50 font-mono text-xs text-rose-200 leading-relaxed focus:outline-none focus:border-rose-400"
            />
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-[#090b13] border-t border-rose-950/70 flex items-center justify-between">
          <div className="text-[11px] text-rose-400/70">
            Amoorion v0.4.33 • Detached OpenAPI &amp; Setup Manager
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#131622] hover:bg-rose-950 text-xs font-medium text-rose-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                try {
                  const parsed = JSON.parse(jsonText);
                  const validation = validateContentSchema(parsed);
                  if (validation.valid) {
                    onSaveContent(parsed);
                    setNotification({ type: 'success', message: 'Applied to live preview!' });
                    onClose();
                  }
                } catch {
                  // ignore
                }
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-xs font-medium text-white shadow transition-all"
            >
              Apply to Live Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
