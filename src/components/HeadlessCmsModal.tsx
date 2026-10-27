import React, { useState, useEffect } from 'react';
import {
  X,
  GitBranch,
  GitCommit,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileJson,
  Sliders,
  Shield,
  Key,
  ExternalLink,
  Save,
  Clock,
  Code,
  Sparkles,
} from 'lucide-react';
import { SiteContent, GitCommitInfo, GitHubAuthStatus, SupportedLanguage } from '../types/content';
import { validateContentSchema, formatCommitDate, mergeContentWithDefaults } from '../utils/content-parser';

interface HeadlessCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: SiteContent;
  onSaveContent: (updated: SiteContent) => void;
  currentLang: SupportedLanguage;
}

export const HeadlessCmsModal: React.FC<HeadlessCmsModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onSaveContent,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'git' | 'json'>('editor');
  const [editorSection, setEditorSection] = useState<'hero' | 'features' | 'meet' | 'links'>('hero');
  const [draftContent, setDraftContent] = useState<SiteContent>(currentContent);
  const [authStatus, setAuthStatus] = useState<GitHubAuthStatus | null>(null);
  const [customToken, setCustomToken] = useState<string>('');
  const [commitMessage, setCommitMessage] = useState<string>('chore(cms): update website content');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [commitsList, setCommitsList] = useState<GitCommitInfo[]>([]);
  const [remoteSha, setRemoteSha] = useState<string | undefined>(undefined);
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(currentContent, null, 2));

  // Sync draft whenever currentContent changes
  useEffect(() => {
    setDraftContent(currentContent);
    setJsonText(JSON.stringify(currentContent, null, 2));
  }, [currentContent]);

  // Fetch GitHub server auth status and commits on modal open
  useEffect(() => {
    if (isOpen) {
      fetchAuthStatus();
      fetchCommitHistory();
    }
  }, [isOpen]);

  const fetchAuthStatus = async () => {
    try {
      const res = await fetch('/api/github/status');
      if (res.ok) {
        const data = await res.json();
        setAuthStatus(data);
      }
    } catch (err) {
      console.warn('Could not fetch GitHub auth status:', err);
    }
  };

  const fetchCommitHistory = async () => {
    try {
      const headers: Record<string, string> = {};
      if (customToken) headers['Authorization'] = `Bearer ${customToken}`;
      
      const res = await fetch(
        `/api/github/commits?owner=${draftContent.cmsConfig.repoOwner}&repo=${draftContent.cmsConfig.repoName}`,
        { headers }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.commits) setCommitsList(data.commits);
      }
    } catch (err) {
      console.warn('Could not fetch commits:', err);
    }
  };

  const handleSyncFromGithub = async () => {
    setIsLoading(true);
    setNotification({ type: 'info', message: 'Pulling latest content from GitHub repository...' });

    try {
      const headers: Record<string, string> = {};
      if (customToken) headers['Authorization'] = `Bearer ${customToken}`;

      const res = await fetch(
        `/api/github/content?owner=${draftContent.cmsConfig.repoOwner}&repo=${draftContent.cmsConfig.repoName}&path=${draftContent.cmsConfig.contentFilePath}&ref=${draftContent.cmsConfig.branch}`,
        { headers }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.parsed) {
          const merged = mergeContentWithDefaults(data.parsed, currentContent);
          setDraftContent(merged);
          setJsonText(JSON.stringify(merged, null, 2));
          setRemoteSha(data.sha);
          onSaveContent(merged);
          setNotification({
            type: 'success',
            message: `Successfully synchronized from ${draftContent.cmsConfig.contentFilePath} (SHA: ${data.sha.slice(0, 7)})`,
          });
        }
      } else {
        const errData = await res.json();
        setNotification({
          type: 'info',
          message: `File not yet initialized in repo. You can push this content to ${draftContent.cmsConfig.repoOwner}/${draftContent.cmsConfig.repoName} using Commit to GitHub.`,
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Sync failed: ${err.message || 'Network error'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitToGithub = async () => {
    // Validate schema first
    const validation = validateContentSchema(draftContent);
    if (!validation.valid) {
      setNotification({
        type: 'error',
        message: `Validation error: ${validation.errors.join(', ')}`,
      });
      return;
    }

    setIsLoading(true);
    setNotification({ type: 'info', message: 'Creating Git commit and pushing to GitHub...' });

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (customToken) headers['Authorization'] = `Bearer ${customToken}`;

      const res = await fetch('/api/github/commit', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          owner: draftContent.cmsConfig.repoOwner,
          repo: draftContent.cmsConfig.repoName,
          path: draftContent.cmsConfig.contentFilePath,
          branch: draftContent.cmsConfig.branch,
          message: commitMessage,
          content: draftContent,
          sha: remoteSha,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRemoteSha(data.contentSha);
        setNotification({
          type: 'success',
          message: `Committed successfully! Commit SHA: ${data.commitSha.slice(0, 7)} to branch ${data.branch}`,
        });
        // Apply locally too
        onSaveContent(draftContent);
        fetchCommitHistory();
      } else {
        setNotification({
          type: 'error',
          message: data.error || data.details || 'Failed to commit to repository',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Commit error: ${err.message || 'Network error'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyLocalChanges = () => {
    const validation = validateContentSchema(draftContent);
    if (!validation.valid) {
      setNotification({
        type: 'error',
        message: `Validation error: ${validation.errors.join(', ')}`,
      });
      return;
    }

    onSaveContent(draftContent);
    setNotification({
      type: 'success',
      message: 'Website content updated in live session!',
    });
  };

  const handleJsonUpdate = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      const validation = validateContentSchema(parsed);
      if (validation.valid) {
        setDraftContent(parsed);
        setNotification(null);
      }
    } catch {
      // Waiting for valid JSON
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0c0f18] border border-rose-800/60 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#090b13] border-b border-rose-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-950 flex items-center justify-center shadow-[0_0_15px_rgba(225,76,98,0.4)]">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif text-[#fbf6f3]">Amoorion Headless Content Studio</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 border border-rose-700/50 text-rose-300 font-mono">
                  Git-Backed CMS
                </span>
              </div>
              <p className="text-xs text-rose-300/60">
                Sync, edit, and push website content directly via GitHub Octokit & isomorphic-git workflows.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#131622] hover:bg-rose-950 text-rose-300 hover:text-white transition-colors"
            aria-label="Close CMS Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2.5 bg-[#0e121e] border-b border-rose-950/40 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-rose-200">
              <GitBranch className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono text-[11px] text-rose-300">
                {draftContent.cmsConfig.repoOwner}/{draftContent.cmsConfig.repoName} ({draftContent.cmsConfig.branch})
              </span>
            </span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1.5 text-xs">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">
                {authStatus?.hasServerToken
                  ? 'Server Env Auth Active (GITHUB_TOKEN)'
                  : 'Public Read Mode / Optional PAT'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncFromGithub}
              disabled={isLoading}
              className="px-3 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 text-[11px]"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Pull from GitHub</span>
            </button>
            <button
              onClick={handleCommitToGithub}
              disabled={isLoading}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium flex items-center gap-1.5 shadow transition-all disabled:opacity-50 text-[11px]"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Commit & Push</span>
            </button>
          </div>
        </div>

        {/* Notification Toast inside Modal */}
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

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-[#0a0d16] border-b border-rose-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 text-xs font-medium rounded-t-xl transition-colors border-t border-x ${
                activeTab === 'editor'
                  ? 'bg-[#0c0f18] text-rose-200 border-rose-800/60 font-semibold'
                  : 'text-gray-400 border-transparent hover:text-rose-300'
              }`}
            >
              Visual Content Editor
            </button>
            <button
              onClick={() => setActiveTab('git')}
              className={`px-4 py-2 text-xs font-medium rounded-t-xl transition-colors border-t border-x ${
                activeTab === 'git'
                  ? 'bg-[#0c0f18] text-rose-200 border-rose-800/60 font-semibold'
                  : 'text-gray-400 border-transparent hover:text-rose-300'
              }`}
            >
              Git Commits & Auth
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-4 py-2 text-xs font-medium rounded-t-xl transition-colors border-t border-x ${
                activeTab === 'json'
                  ? 'bg-[#0c0f18] text-rose-200 border-rose-800/60 font-semibold'
                  : 'text-gray-400 border-transparent hover:text-rose-300'
              }`}
            >
              Raw Schema JSON
            </button>
          </div>

          <button
            onClick={handleApplyLocalChanges}
            className="flex items-center gap-1.5 px-3 py-1 mb-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 text-rose-200 text-xs font-medium transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-rose-400" />
            <span>Apply to Live Site</span>
          </button>
        </div>

        {/* Tab 1: Visual Content Editor */}
        {activeTab === 'editor' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Section Switcher Pills */}
            <div className="flex items-center gap-2 pb-2 border-b border-rose-950/40">
              <button
                onClick={() => setEditorSection('hero')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  editorSection === 'hero' ? 'bg-rose-600/30 text-white border border-rose-500/50' : 'text-gray-400 hover:text-rose-300'
                }`}
              >
                Hero Header
              </button>
              <button
                onClick={() => setEditorSection('features')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  editorSection === 'features' ? 'bg-rose-600/30 text-white border border-rose-500/50' : 'text-gray-400 hover:text-rose-300'
                }`}
              >
                Feature Cards (3)
              </button>
              <button
                onClick={() => setEditorSection('meet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  editorSection === 'meet' ? 'bg-rose-600/30 text-white border border-rose-500/50' : 'text-gray-400 hover:text-rose-300'
                }`}
              >
                Meet Amoorion
              </button>
              <button
                onClick={() => setEditorSection('links')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  editorSection === 'links' ? 'bg-rose-600/30 text-white border border-rose-500/50' : 'text-gray-400 hover:text-rose-300'
                }`}
              >
                Ecosystem Links
              </button>
            </div>

            {/* HERO SECTION FORM */}
            {editorSection === 'hero' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-rose-300 mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={draftContent.hero.badge}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          hero: { ...draftContent.hero, badge: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-rose-300 mb-1">Pip Install Command</label>
                    <input
                      type="text"
                      value={draftContent.hero.pipCommand}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          hero: { ...draftContent.hero, pipCommand: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs font-mono text-rose-100 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={draftContent.hero.title}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, title: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121522] border border-rose-900/50 text-sm text-rose-100 font-serif focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={draftContent.hero.subtitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none focus:border-rose-400 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-rose-300 mb-1">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={draftContent.hero.primaryCtaText}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          hero: { ...draftContent.hero, primaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-rose-300 mb-1">Secondary CTA Button Label</label>
                    <input
                      type="text"
                      value={draftContent.hero.secondaryCtaText}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          hero: { ...draftContent.hero, secondaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FEATURES CARDS FORM */}
            {editorSection === 'features' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-rose-300 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={draftContent.featuresSection.title}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          featuresSection: { ...draftContent.featuresSection, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-rose-300 mb-1">Section Subtitle</label>
                    <input
                      type="text"
                      value={draftContent.featuresSection.subtitle}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          featuresSection: { ...draftContent.featuresSection, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {draftContent.featuresSection.cards.map((card, index) => (
                    <div key={card.id} className="p-4 rounded-2xl bg-[#101422] border border-rose-950/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-300 uppercase">
                          Card #{index + 1}: {card.title} ({card.icon})
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">ID: {card.id}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-gray-400 mb-1">Title</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const updatedCards = [...draftContent.featuresSection.cards];
                              updatedCards[index] = { ...card, title: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                featuresSection: { ...draftContent.featuresSection, cards: updatedCards },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0d16] border border-rose-900/40 text-xs text-rose-100 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-400 mb-1">Badge Tag</label>
                          <input
                            type="text"
                            value={card.badge || ''}
                            onChange={(e) => {
                              const updatedCards = [...draftContent.featuresSection.cards];
                              updatedCards[index] = { ...card, badge: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                featuresSection: { ...draftContent.featuresSection, cards: updatedCards },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0d16] border border-rose-900/40 text-xs text-rose-100 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={card.description}
                          onChange={(e) => {
                            const updatedCards = [...draftContent.featuresSection.cards];
                            updatedCards[index] = { ...card, description: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              featuresSection: { ...draftContent.featuresSection, cards: updatedCards },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0d16] border border-rose-900/40 text-xs text-rose-100 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MEET AMOORION FORM */}
            {editorSection === 'meet' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={draftContent.meetAmoorion.title}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        meetAmoorion: { ...draftContent.meetAmoorion, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">Paragraph 1 (Core definition)</label>
                  <textarea
                    rows={3}
                    value={draftContent.meetAmoorion.paragraphs[0] || ''}
                    onChange={(e) => {
                      const updated = [...draftContent.meetAmoorion.paragraphs];
                      updated[0] = e.target.value;
                      setDraftContent({
                        ...draftContent,
                        meetAmoorion: { ...draftContent.meetAmoorion, paragraphs: updated },
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">Paragraph 2 (Vision & welcome)</label>
                  <textarea
                    rows={3}
                    value={draftContent.meetAmoorion.paragraphs[1] || ''}
                    onChange={(e) => {
                      const updated = [...draftContent.meetAmoorion.paragraphs];
                      updated[1] = e.target.value;
                      setDraftContent({
                        ...draftContent,
                        meetAmoorion: { ...draftContent.meetAmoorion, paragraphs: updated },
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* LINKS FORM */}
            {editorSection === 'links' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={draftContent.links.github}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        links: { ...draftContent.links, github: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">ReadTheDocs Documentation</label>
                  <input
                    type="text"
                    value={draftContent.links.readthedocs}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        links: { ...draftContent.links, readthedocs: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">PyPI Package URL</label>
                  <input
                    type="text"
                    value={draftContent.links.pypi}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        links: { ...draftContent.links, pypi: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">GitHub Pages Deployment URL</label>
                  <input
                    type="text"
                    value={draftContent.links.githubPages}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        links: { ...draftContent.links, githubPages: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#121522] border border-rose-900/50 text-xs text-rose-100 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Git Commits & Auth */}
        {activeTab === 'git' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Git Configuration Box */}
            <div className="p-4 rounded-2xl bg-[#101422] border border-rose-900/40 space-y-4">
              <h4 className="text-xs font-semibold text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-rose-400" />
                <span>Target Repository Configuration</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Owner / Organization</label>
                  <input
                    type="text"
                    value={draftContent.cmsConfig.repoOwner}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        cmsConfig: { ...draftContent.cmsConfig, repoOwner: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0d16] border border-rose-900/40 text-xs text-rose-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Repository Name</label>
                  <input
                    type="text"
                    value={draftContent.cmsConfig.repoName}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        cmsConfig: { ...draftContent.cmsConfig, repoName: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0d16] border border-rose-900/40 text-xs text-rose-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Branch</label>
                  <input
                    type="text"
                    value={draftContent.cmsConfig.branch}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        cmsConfig: { ...draftContent.cmsConfig, branch: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0d16] border border-rose-900/40 text-xs text-rose-100"
                  />
                </div>
              </div>
            </div>

            {/* Commit Message Box */}
            <div className="p-4 rounded-2xl bg-[#101422] border border-rose-900/40 space-y-3">
              <h4 className="text-xs font-semibold text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-rose-400" />
                <span>Commit & Push to GitHub</span>
              </h4>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Git Commit Message</label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="e.g. chore(content): update hero and features via CMS"
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0d16] border border-rose-900/50 text-xs text-rose-100"
                />
              </div>

              {/* Optional PAT override */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3 text-rose-400" />
                  <span>Session Personal Access Token (PAT) [Optional if GITHUB_TOKEN set in server env]</span>
                </label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={customToken}
                  onChange={(e) => setCustomToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0d16] border border-rose-900/50 text-xs text-rose-100 font-mono"
                />
              </div>
            </div>

            {/* Commits History Log */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Recent Git Commit Activity</span>
                </h4>
                <button
                  onClick={fetchCommitHistory}
                  className="text-xs text-rose-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Log</span>
                </button>
              </div>

              <div className="divide-y divide-rose-950/60 rounded-2xl bg-[#0a0d16] border border-rose-900/40 overflow-hidden">
                {commitsList.length === 0 ? (
                  <div className="p-4 text-xs text-gray-500 text-center">No commits loaded yet</div>
                ) : (
                  commitsList.map((c) => (
                    <div key={c.sha} className="p-3 text-xs flex items-center justify-between hover:bg-rose-950/20">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
                            {c.sha}
                          </span>
                          <span className="font-medium text-rose-100">{c.message}</span>
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {c.author.name} • {formatCommitDate(c.author.date)}
                        </div>
                      </div>
                      {c.html_url && (
                        <a
                          href={c.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-rose-400/80 hover:text-rose-200 flex items-center gap-1 shrink-0 ml-3"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Raw JSON / Schema */}
        {activeTab === 'json' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-300 font-mono">
                File: {draftContent.cmsConfig.contentFilePath}
              </span>
              <button
                onClick={() => {
                  const blob = new Blob([jsonText], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'site-content.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="text-xs text-rose-400 hover:text-white flex items-center gap-1"
              >
                <span>Download site-content.json</span>
              </button>
            </div>
            <textarea
              rows={16}
              value={jsonText}
              onChange={(e) => handleJsonUpdate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#080a12] border border-rose-900/50 font-mono text-xs text-rose-200 leading-relaxed focus:outline-none focus:border-rose-400"
            />
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#090b13] border-t border-rose-950/70 flex items-center justify-between">
          <div className="text-[11px] text-rose-400/70">
            Powered by Octokit REST API & isomorphic-git workflows
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
                handleApplyLocalChanges();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-xs font-medium text-white shadow transition-all"
            >
              Save & Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
