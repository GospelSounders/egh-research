'use client';

import { useState } from 'react';
import { 
  AcademicCapIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ClockIcon,
  DocumentTextIcon,
  BookOpenIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface CompilationSettings {
  topic: string;
  subtopics: string[];
  includeBooks: string[];
  includeContentTypes: string[];
  maxPages: number;
  citationStyle: 'apa' | 'mla' | 'chicago';
  includeIndex: boolean;
  includeBibliography: boolean;
  pageSize: 'letter' | 'a4';
  fontSize: number;
  lineSpacing: number;
}

interface CompilationProgress {
  status: 'idle' | 'searching' | 'compiling' | 'formatting' | 'complete' | 'error';
  currentStep: string;
  progress: number;
  totalSources: number;
  processedSources: number;
  estimatedTimeRemaining: string;
  errors: string[];
  warnings: string[];
}

export function CompilationPage() {
  const [settings, setSettings] = useState<CompilationSettings>({
    topic: '',
    subtopics: [],
    includeBooks: [],
    includeContentTypes: ['Books', 'Letters', 'Manuscripts'],
    maxPages: 50,
    citationStyle: 'apa',
    includeIndex: true,
    includeBibliography: true,
    pageSize: 'letter',
    fontSize: 12,
    lineSpacing: 1.5
  });

  const [progress, setProgress] = useState<CompilationProgress>({
    status: 'idle',
    currentStep: '',
    progress: 0,
    totalSources: 0,
    processedSources: 0,
    estimatedTimeRemaining: '',
    errors: [],
    warnings: []
  });

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [topicSuggestions, setTopicSuggestions] = useState<string[]>([]);

  const TOPIC_SUGGESTIONS = [
    'Righteousness by Faith',
    'Health and Temperance',
    'Education and Character Development',
    'Prayer and Spiritual Life',
    'Prophecy and End Times',
    'Sabbath Observance',
    'Christian Stewardship',
    'Church Organization',
    'Mission and Evangelism',
    'Bible Study Methods'
  ];

  const BOOK_OPTIONS = [
    'The Desire of Ages',
    'The Great Controversy',
    'Steps to Christ',
    'Patriarchs and Prophets',
    'The Acts of the Apostles',
    'Prophets and Kings',
    'Education',
    'Ministry of Healing',
    'Christ\'s Object Lessons',
    'Thoughts from the Mount of Blessing'
  ];

  const CONTENT_TYPES = [
    'Books',
    'Letters',
    'Manuscripts',
    'Periodical Articles',
    'Bible Comments',
    'Sermons'
  ];

  const handleTopicChange = (value: string) => {
    setSettings(prev => ({ ...prev, topic: value }));
    
    // Show suggestions when typing
    if (value.length > 2) {
      const filtered = TOPIC_SUGGESTIONS.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setTopicSuggestions(filtered);
    } else {
      setTopicSuggestions([]);
    }
  };

  const handleArrayToggle = (key: keyof CompilationSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(item => item !== value)
        : [...(prev[key] as string[]), value]
    }));
  };

  const startCompilation = async () => {
    if (!settings.topic.trim()) return;

    setProgress({
      status: 'searching',
      currentStep: 'Searching for relevant content...',
      progress: 0,
      totalSources: 0,
      processedSources: 0,
      estimatedTimeRemaining: 'Calculating...',
      errors: [],
      warnings: []
    });

    // Simulate compilation process
    setTimeout(() => {
      setProgress(prev => ({
        ...prev,
        status: 'compiling',
        currentStep: 'Compiling and organizing content...',
        progress: 25,
        totalSources: 45,
        processedSources: 12,
        estimatedTimeRemaining: '3 minutes'
      }));
    }, 2000);

    setTimeout(() => {
      setProgress(prev => ({
        ...prev,
        status: 'formatting',
        currentStep: 'Formatting PDF and adding citations...',
        progress: 75,
        processedSources: 38,
        estimatedTimeRemaining: '1 minute'
      }));
    }, 5000);

    setTimeout(() => {
      setProgress(prev => ({
        ...prev,
        status: 'complete',
        currentStep: 'Compilation complete!',
        progress: 100,
        processedSources: 45,
        estimatedTimeRemaining: '0 minutes'
      }));
    }, 8000);
  };

  const getStatusColor = (status: CompilationProgress['status']) => {
    switch (status) {
      case 'searching': return 'text-blue-600';
      case 'compiling': return 'text-yellow-600';
      case 'formatting': return 'text-purple-600';
      case 'complete': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800 mb-4">
            <AcademicCapIcon className="h-4 w-4 mr-2" />
            Research Compilation Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
            Create Custom Research Compilations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive PDF compilations on any topic from Ellen G. White writings. 
            Perfect for Bible studies, sermons, and academic research.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Research Topic</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your research topic (e.g., 'Righteousness by Faith')"
                  value={settings.topic}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {topicSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {topicSuggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSettings(prev => ({ ...prev, topic: suggestion }));
                          setTopicSuggestions([]);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popular Research Topics
                </label>
                <div className="flex flex-wrap gap-2">
                  {TOPIC_SUGGESTIONS.slice(0, 6).map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSettings(prev => ({ ...prev, topic }))}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Sources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Sources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Include Books
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    <label className="flex items-center py-1 mb-2">
                      <input
                        type="checkbox"
                        checked={settings.includeBooks.length === BOOK_OPTIONS.length}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            includeBooks: e.target.checked ? [...BOOK_OPTIONS] : []
                          }));
                        }}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Select All</span>
                    </label>
                    {BOOK_OPTIONS.map(book => (
                      <label key={book} className="flex items-center py-1">
                        <input
                          type="checkbox"
                          checked={settings.includeBooks.includes(book)}
                          onChange={() => handleArrayToggle('includeBooks', book)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{book}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Content Types
                  </label>
                  <div className="space-y-2">
                    {CONTENT_TYPES.map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.includeContentTypes.includes(type)}
                          onChange={() => handleArrayToggle('includeContentTypes', type)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-xl font-semibold text-gray-900">Advanced Settings</h2>
                <Cog6ToothIcon className={`h-5 w-5 text-gray-400 transition-transform ${showAdvancedSettings ? 'rotate-90' : ''}`} />
              </button>

              {showAdvancedSettings && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Pages
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={settings.maxPages}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxPages: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Citation Style
                    </label>
                    <select
                      value={settings.citationStyle}
                      onChange={(e) => setSettings(prev => ({ ...prev, citationStyle: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="apa">APA Style</option>
                      <option value="mla">MLA Style</option>
                      <option value="chicago">Chicago Style</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Size
                    </label>
                    <select
                      value={settings.pageSize}
                      onChange={(e) => setSettings(prev => ({ ...prev, pageSize: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="letter">Letter (8.5" × 11")</option>
                      <option value="a4">A4 (210mm × 297mm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => setSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value={10}>10pt</option>
                      <option value={11}>11pt</option>
                      <option value={12}>12pt</option>
                      <option value={14}>14pt</option>
                      <option value={16}>16pt</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.includeIndex}
                          onChange={(e) => setSettings(prev => ({ ...prev, includeIndex: e.target.checked }))}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Include Index</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.includeBibliography}
                          onChange={(e) => setSettings(prev => ({ ...prev, includeBibliography: e.target.checked }))}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Include Bibliography</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={startCompilation}
                disabled={!settings.topic.trim() || progress.status !== 'idle'}
                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors text-lg"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Generate Research Compilation
              </button>
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compilation Progress</h3>
              
              {progress.status === 'idle' ? (
                <div className="text-center py-8">
                  <DocumentArrowDownIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Ready to generate your compilation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getStatusColor(progress.status)}`}>
                      {progress.currentStep}
                    </span>
                    <span className="text-sm text-gray-500">
                      {progress.progress}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>

                  {progress.totalSources > 0 && (
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Sources processed:</span>
                        <span>{progress.processedSources}/{progress.totalSources}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated time:</span>
                        <span>{progress.estimatedTimeRemaining}</span>
                      </div>
                    </div>
                  )}

                  {progress.status === 'complete' && (
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors">
                      <DocumentArrowDownIcon className="h-5 w-5 inline mr-2" />
                      Download PDF
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Books:</span>
                  <span className="text-sm font-medium">85+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Writings:</span>
                  <span className="text-sm font-medium">25,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Languages:</span>
                  <span className="text-sm font-medium">100+</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                <InformationCircleIcon className="h-5 w-5 inline mr-2" />
                Pro Tips
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Use specific topics for better results</li>
                <li>• Include multiple content types for comprehensive coverage</li>
                <li>• Limit pages for focused studies</li>
                <li>• Enable index for easy navigation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}