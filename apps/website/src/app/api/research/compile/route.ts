import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

interface CompilationRequest {
  topic: string;
  maxResults?: number;
  groupBy?: 'book' | 'topic' | 'chronological';
  citationStyle?: 'academic' | 'simple' | 'detailed';
  outputFormat?: 'pdf' | 'docx' | 'markdown';
  includeContext?: boolean;
  languages?: string[];
}

interface CompilationResponse {
  success: boolean;
  jobId: string;
  message: string;
  estimatedDuration?: number;
  error?: string;
}

// In-memory job tracking (in production, use Redis or database)
const activeJobs = new Map<string, {
  status: 'queued' | 'running' | 'completed' | 'failed';
  topic: string;
  startTime: Date;
  progress: number;
  message: string;
}>();

export async function POST(request: NextRequest): Promise<NextResponse<CompilationResponse>> {
  try {
    const body: CompilationRequest = await request.json();
    
    // Validate request
    if (!body.topic || body.topic.trim().length === 0) {
      return NextResponse.json({
        success: false,
        jobId: '',
        message: 'Topic is required'
      }, { status: 400 });
    }

    // Generate unique job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Initialize job tracking
    activeJobs.set(jobId, {
      status: 'queued',
      topic: body.topic,
      startTime: new Date(),
      progress: 0,
      message: 'Research compilation queued'
    });

    // Start background compilation process
    startCompilationProcess(jobId, body);

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Research compilation started',
      estimatedDuration: estimateCompilationTime(body.maxResults || 50)
    });

  } catch (error) {
    console.error('Compilation API error:', error);
    return NextResponse.json({
      success: false,
      jobId: '',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({
      error: 'jobId parameter is required'
    }, { status: 400 });
  }

  const job = activeJobs.get(jobId);
  if (!job) {
    return NextResponse.json({
      error: 'Job not found'
    }, { status: 404 });
  }

  return NextResponse.json({
    jobId,
    status: job.status,
    topic: job.topic,
    progress: job.progress,
    message: job.message,
    startTime: job.startTime,
    duration: Date.now() - job.startTime.getTime()
  });
}

async function startCompilationProcess(jobId: string, request: CompilationRequest) {
  const job = activeJobs.get(jobId);
  if (!job) return;

  try {
    // Update job status
    job.status = 'running';
    job.progress = 10;
    job.message = 'Starting Claude Code sandbox...';

    // Create temporary configuration for this compilation
    const tempConfigPath = await createTempConfig(jobId, request);
    
    // Update progress
    job.progress = 20;
    job.message = 'Searching EGW database...';

    // In a real implementation, this would start claude-code-sandbox
    // For now, simulate the process
    await simulateCompilationProcess(jobId, request);

  } catch (error) {
    console.error(`Compilation failed for job ${jobId}:`, error);
    const job = activeJobs.get(jobId);
    if (job) {
      job.status = 'failed';
      job.message = `Compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}

async function createTempConfig(jobId: string, request: CompilationRequest): Promise<string> {
  const config = {
    name: `egw-research-${jobId}`,
    description: `Automated research compilation for: ${request.topic}`,
    environment: {
      RESEARCH_TOPIC: request.topic,
      MAX_RESULTS: request.maxResults?.toString() || '50',
      GROUP_BY: request.groupBy || 'book',
      CITATION_STYLE: request.citationStyle || 'academic',
      OUTPUT_FORMAT: request.outputFormat || 'pdf',
      JOB_ID: jobId
    },
    initialPrompt: `
Conduct automated research compilation on: "${request.topic}"

Parameters:
- Max Results: ${request.maxResults || 50}
- Organization: ${request.groupBy || 'book'}
- Citation Style: ${request.citationStyle || 'academic'}
- Output Format: ${request.outputFormat || 'pdf'}

Steps:
1. Search EGW database for relevant passages
2. Organize findings according to specified grouping
3. Generate formatted document with proper citations
4. Save output to /workspace/output/${sanitizeFilename(request.topic)}.${request.outputFormat || 'pdf'}
5. Commit results to repository

Begin compilation now.
    `.trim()
  };

  const configPath = path.join(process.cwd(), 'temp', `config-${jobId}.json`);
  await mkdir(path.dirname(configPath), { recursive: true });
  await writeFile(configPath, JSON.stringify(config, null, 2));
  
  return configPath;
}

async function simulateCompilationProcess(jobId: string, request: CompilationRequest) {
  const job = activeJobs.get(jobId);
  if (!job) return;

  // Simulate compilation stages
  const stages = [
    { progress: 30, message: 'Processing search results...', duration: 2000 },
    { progress: 50, message: 'Organizing content by topic...', duration: 3000 },
    { progress: 70, message: 'Formatting document...', duration: 2000 },
    { progress: 90, message: 'Generating PDF...', duration: 2000 },
    { progress: 100, message: 'Compilation complete!', duration: 1000 }
  ];

  for (const stage of stages) {
    await new Promise(resolve => setTimeout(resolve, stage.duration));
    
    const currentJob = activeJobs.get(jobId);
    if (currentJob) {
      currentJob.progress = stage.progress;
      currentJob.message = stage.message;
      
      if (stage.progress === 100) {
        currentJob.status = 'completed';
      }
    }
  }
}

function estimateCompilationTime(maxResults: number): number {
  // Estimate based on number of results
  const baseTime = 60; // Base 60 seconds
  const perResultTime = 0.5; // 0.5 seconds per result
  return Math.round(baseTime + (maxResults * perResultTime));
}

function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}