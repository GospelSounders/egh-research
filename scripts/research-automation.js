#!/usr/bin/env node

/**
 * Research Automation Script for EGW Research Platform
 * 
 * This script demonstrates how to integrate claude-code-sandbox
 * for automated research compilation workflows.
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

class ResearchAutomation {
  constructor() {
    this.configPath = path.join(rootDir, 'claude-sandbox-config.json');
    this.outputDir = path.join(rootDir, 'research-output');
  }

  async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      console.log(`✅ Output directory ready: ${this.outputDir}`);
    } catch (error) {
      console.error(`❌ Failed to create output directory: ${error.message}`);
      throw error;
    }
  }

  async validateSandboxConfig() {
    try {
      const config = JSON.parse(await fs.readFile(this.configPath, 'utf8'));
      console.log(`✅ Sandbox configuration loaded: ${config.name}`);
      return config;
    } catch (error) {
      console.error(`❌ Failed to load sandbox config: ${error.message}`);
      throw error;
    }
  }

  async startResearchSession(topic, options = {}) {
    const {
      maxResults = 50,
      groupBy = 'book',
      citationStyle = 'academic',
      outputFormat = 'pdf'
    } = options;

    console.log(`🔍 Starting automated research compilation for: "${topic}"`);
    
    const researchPrompt = `
Please conduct an automated research compilation on the topic: "${topic}"

Follow these steps:
1. Use the EGW database tools to search for relevant passages
2. Limit results to ${maxResults} passages
3. Organize findings by ${groupBy}
4. Use ${citationStyle} citation style
5. Generate ${outputFormat.toUpperCase()} output
6. Save to /workspace/output/${this.sanitizeFilename(topic)}.${outputFormat}

Configuration:
- Max Results: ${maxResults}
- Organization: ${groupBy}
- Citation Style: ${citationStyle}
- Output Format: ${outputFormat}

Begin the research compilation process.
    `.trim();

    try {
      // Start claude-code-sandbox with our configuration
      const sandboxProcess = spawn('npx', [
        '@textcortex/claude-code-sandbox',
        'start',
        '--config', this.configPath,
        '--prompt', researchPrompt,
        '--auto-commit'
      ], {
        stdio: 'inherit',
        cwd: rootDir
      });

      return new Promise((resolve, reject) => {
        sandboxProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`✅ Research compilation completed for: "${topic}"`);
            resolve({ topic, success: true });
          } else {
            console.error(`❌ Research compilation failed with code: ${code}`);
            reject(new Error(`Sandbox process exited with code ${code}`));
          }
        });

        sandboxProcess.on('error', (error) => {
          console.error(`❌ Failed to start sandbox: ${error.message}`);
          reject(error);
        });
      });

    } catch (error) {
      console.error(`❌ Research automation failed: ${error.message}`);
      throw error;
    }
  }

  async batchResearch(topics, options = {}) {
    console.log(`📚 Starting batch research compilation for ${topics.length} topics`);
    
    const results = [];
    
    for (const topic of topics) {
      try {
        console.log(`\n📖 Processing topic ${results.length + 1}/${topics.length}: "${topic}"`);
        const result = await this.startResearchSession(topic, options);
        results.push(result);
        
        // Wait between requests to avoid overwhelming the system
        if (results.length < topics.length) {
          console.log('⏳ Waiting 30 seconds before next compilation...');
          await this.sleep(30000);
        }
      } catch (error) {
        console.error(`❌ Failed to process topic "${topic}": ${error.message}`);
        results.push({ topic, success: false, error: error.message });
      }
    }

    return results;
  }

  async listCompletedResearch() {
    try {
      const files = await fs.readdir(this.outputDir);
      const researchFiles = files.filter(file => 
        file.endsWith('.pdf') || file.endsWith('.docx') || file.endsWith('.md')
      );

      console.log(`📋 Completed research compilations (${researchFiles.length}):`);
      for (const file of researchFiles) {
        const stats = await fs.stat(path.join(this.outputDir, file));
        console.log(`  • ${file} (${this.formatFileSize(stats.size)}, ${stats.mtime.toLocaleDateString()})`);
      }

      return researchFiles;
    } catch (error) {
      console.error(`❌ Failed to list research files: ${error.message}`);
      return [];
    }
  }

  sanitizeFilename(filename) {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
async function main() {
  const automation = new ResearchAutomation();
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    await automation.ensureOutputDirectory();
    await automation.validateSandboxConfig();

    switch (command) {
      case 'research':
        const topic = args[1];
        if (!topic) {
          console.error('❌ Please provide a research topic');
          console.log('Usage: node research-automation.js research "topic name"');
          process.exit(1);
        }
        
        const options = {
          maxResults: parseInt(args[2]) || 50,
          groupBy: args[3] || 'book',
          citationStyle: args[4] || 'academic'
        };
        
        await automation.startResearchSession(topic, options);
        break;

      case 'batch':
        const configFile = args[1];
        if (!configFile) {
          console.error('❌ Please provide a batch configuration file');
          console.log('Usage: node research-automation.js batch batch-config.json');
          process.exit(1);
        }
        
        const batchConfig = JSON.parse(await fs.readFile(configFile, 'utf8'));
        await automation.batchResearch(batchConfig.topics, batchConfig.options);
        break;

      case 'list':
        await automation.listCompletedResearch();
        break;

      case 'help':
      default:
        console.log(`
📚 EGW Research Automation Tool

Commands:
  research <topic> [maxResults] [groupBy] [citationStyle]
    Start automated research compilation for a single topic
    
  batch <config-file>
    Run batch research compilation from configuration file
    
  list
    List all completed research compilations
    
  help
    Show this help message

Examples:
  node research-automation.js research "salvation by faith"
  node research-automation.js research "health principles" 100 topic academic
  node research-automation.js batch batch-topics.json
  node research-automation.js list

Batch Configuration File Example:
{
  "topics": [
    "salvation by faith",
    "health principles", 
    "education philosophy"
  ],
  "options": {
    "maxResults": 75,
    "groupBy": "book",
    "citationStyle": "academic",
    "outputFormat": "pdf"
  }
}
        `);
        break;
    }

  } catch (error) {
    console.error(`❌ Automation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ResearchAutomation };