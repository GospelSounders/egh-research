'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CogIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  BookOpenIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface CompilationSettings {
  maxResults: number;
  groupBy: 'book' | 'topic' | 'chronological';
  includeContext: boolean;
  citationStyle: 'academic' | 'simple' | 'detailed';
  outputFormat: 'pdf' | 'docx' | 'markdown';
  languages: string[];
}

interface CompilationProgress {
  stage: 'idle' | 'searching' | 'processing' | 'formatting' | 'generating' | 'complete' | 'error';
  progress: number;
  currentTask: string;
  resultsFound: number;
  estimatedTime: number;
}

export default function ResearchCompilePage() {
  const [topic, setTopic] = useState('');
  const [settings, setSettings] = useState<CompilationSettings>({
    maxResults: 50,
    groupBy: 'book',
    includeContext: false,
    citationStyle: 'academic',
    outputFormat: 'pdf',
    languages: ['en']
  });
  const [progress, setProgress] = useState<CompilationProgress>({
    stage: 'idle',
    progress: 0,
    currentTask: '',
    resultsFound: 0,
    estimatedTime: 0
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleStartCompilation = async () => {
    if (!topic.trim()) return;

    setProgress({
      stage: 'searching',
      progress: 10,
      currentTask: 'Searching EGW database...',
      resultsFound: 0,
      estimatedTime: 120
    });

    // Simulate compilation process
    try {
      // Stage 1: Searching
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(prev => ({
        ...prev,
        stage: 'processing',
        progress: 30,
        currentTask: 'Processing search results...',
        resultsFound: 47
      }));

      // Stage 2: Processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(prev => ({
        ...prev,
        stage: 'formatting',
        progress: 60,
        currentTask: 'Organizing content by topic...',
        estimatedTime: 60
      }));

      // Stage 3: Formatting
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(prev => ({
        ...prev,
        stage: 'generating',
        progress: 90,
        currentTask: 'Generating PDF document...',
        estimatedTime: 15
      }));

      // Stage 4: Complete
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(prev => ({
        ...prev,
        stage: 'complete',
        progress: 100,
        currentTask: 'Compilation complete!',
        estimatedTime: 0
      }));

    } catch (error) {
      setProgress(prev => ({
        ...prev,
        stage: 'error',
        currentTask: 'An error occurred during compilation'
      }));
    }
  };

  const getStageIcon = () => {
    switch (progress.stage) {
      case 'complete':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-primary-600 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold font-serif mb-4">
            Research Compilation
          </h1>
          <p className="text-lg text-primary-100">
            Enter a research topic and automatically compile relevant passages from Ellen G. White writings
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Topic Input */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Research Topic</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to research?
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., salvation, prayer, health principles, second coming"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Suggested Topics */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Popular research topics:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Salvation by Faith',
                  'Health and Temperance',
                  'Education Principles',
                  'Second Coming',
                  'Sabbath Observance',
                  'Prayer and Devotion',
                  'Family Life',
                  'Christian Service'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setTopic(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Compilation Settings</h2>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Results
                </label>
                <select
                  value={settings.maxResults}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxResults: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={25}>25 passages</option>
                  <option value={50}>50 passages</option>
                  <option value={100}>100 passages</option>
                  <option value={200}>200 passages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization
                </label>
                <select
                  value={settings.groupBy}
                  onChange={(e) => setSettings(prev => ({ ...prev, groupBy: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="book">Group by Book</option>
                  <option value="topic">Group by Topic</option>
                  <option value="chronological">Chronological Order</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Citation Style
                </label>
                <select
                  value={settings.citationStyle}
                  onChange={(e) => setSettings(prev => ({ ...prev, citationStyle: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="academic">Academic (Full Citations)</option>
                  <option value="simple">Simple (Book & Page)</option>
                  <option value="detailed">Detailed (With Context)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <select
                  value={settings.outputFormat}
                  onChange={(e) => setSettings(prev => ({ ...prev, outputFormat: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="docx">Word Document</option>
                  <option value="markdown">Markdown File</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeContext"
                    checked={settings.includeContext}
                    onChange={(e) => setSettings(prev => ({ ...prev, includeContext: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="includeContext" className="ml-2 text-sm text-gray-700">
                    Include surrounding context for each passage
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.languages.includes('en')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings(prev => ({ ...prev, languages: [...prev.languages, 'en'] }));
                          } else {
                            setSettings(prev => ({ ...prev, languages: prev.languages.filter(l => l !== 'en') }));
                          }
                        }}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">English</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.languages.includes('es')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings(prev => ({ ...prev, languages: [...prev.languages, 'es'] }));
                          } else {
                            setSettings(prev => ({ ...prev, languages: prev.languages.filter(l => l !== 'es') }));
                          }
                        }}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Spanish</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compilation Progress */}
        {progress.stage !== 'idle' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Compilation Progress</h2>
              {getStageIcon()}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{progress.currentTask}</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>

            {/* Status Information */}
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Results Found:</span>
                <span className="ml-2 font-medium">{progress.resultsFound}</span>
              </div>
              <div>
                <span className="text-gray-600">Estimated Time:</span>
                <span className="ml-2 font-medium">{progress.estimatedTime}s</span>
              </div>
              <div>
                <span className="text-gray-600">Output Format:</span>
                <span className="ml-2 font-medium">{settings.outputFormat.toUpperCase()}</span>
              </div>
            </div>

            {/* Complete State */}
            {progress.stage === 'complete' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Compilation Complete!</span>
                  </div>
                  <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
                <p className="text-green-700 text-sm mt-2">
                  Your research compilation on "{topic}" has been generated with {progress.resultsFound} relevant passages.
                </p>
              </div>
            )}

            {/* Error State */}
            {progress.stage === 'error' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">Compilation Failed</span>
                </div>
                <p className="text-red-700 text-sm mt-2">
                  An error occurred during compilation. Please try again or contact support if the problem persists.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartCompilation}
            disabled={!topic.trim() || progress.stage === 'searching' || progress.stage === 'processing' || progress.stage === 'formatting' || progress.stage === 'generating'}
            className="flex items-center px-8 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            Start Compilation
          </button>

          {progress.stage === 'idle' && (
            <button className="flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Preview Search
            </button>
          )}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <CogIcon className="h-6 w-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Feature In Development</h3>
              <p className="text-amber-700 mb-4">
                The automated research compilation feature is currently under development. This interface demonstrates 
                the planned functionality and user experience.
              </p>
              <div className="text-amber-700 text-sm space-y-1">
                <p><strong>Planned Features:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Integration with claude-code-sandbox for automated MCP searches</li>
                  <li>Intelligent topic analysis and content organization</li>
                  <li>Multiple output formats with professional formatting</li>
                  <li>Custom citation styles and bibliography generation</li>
                  <li>Real-time progress tracking and result preview</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}