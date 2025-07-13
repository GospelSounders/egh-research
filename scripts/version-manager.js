#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Package locations
const packages = [
  'packages/shared',
  'packages/egw-pdf-generator',
  'apps/api-server',
  'apps/downloader', 
  'apps/local-server',
  'apps/website'
];

function getCurrentVersion(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

function updateVersion(packagePath, newVersion) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ Updated ${packagePath} to version ${newVersion}`);
}

function bumpVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${bumpType}. Use major, minor, or patch.`);
  }
}

function hasChanges(packagePath) {
  try {
    // Check if there are uncommitted changes in this package
    const gitStatus = execSync(`git status --porcelain ${packagePath}`, { 
      encoding: 'utf8',
      cwd: rootDir 
    });
    
    // Check if there are commits since last tag for this package  
    const lastTag = execSync(`git describe --tags --abbrev=0 --match="*" 2>/dev/null || echo "HEAD"`, {
      encoding: 'utf8',
      cwd: rootDir
    }).trim();
    
    const commits = execSync(`git log ${lastTag}..HEAD --oneline -- ${packagePath}`, {
      encoding: 'utf8',
      cwd: rootDir
    });
    
    return gitStatus.length > 0 || commits.length > 0;
  } catch (error) {
    // If git commands fail, assume there are changes
    return true;
  }
}

function getChangesSummary(packagePath) {
  try {
    const lastTag = execSync(`git describe --tags --abbrev=0 --match="*" 2>/dev/null || echo "HEAD~10"`, {
      encoding: 'utf8',
      cwd: rootDir
    }).trim();
    
    const commits = execSync(`git log ${lastTag}..HEAD --oneline --pretty=format:"%s" -- ${packagePath}`, {
      encoding: 'utf8',
      cwd: rootDir
    });
    
    return commits.split('\n').filter(line => line.trim()).slice(0, 5);
  } catch (error) {
    return ['Recent changes detected'];
  }
}

// Command line interface
const command = process.argv[2];
const bumpType = process.argv[3];
const specificPackage = process.argv[4];

switch (command) {
  case 'status':
    console.log('📦 Package Version Status:\n');
    
    packages.forEach(pkg => {
      const fullPath = path.join(rootDir, pkg);
      const version = getCurrentVersion(fullPath);
      const changes = hasChanges(pkg);
      const status = changes ? '🔄 CHANGES' : '✅ CLEAN';
      
      console.log(`${status} ${pkg}: v${version}`);
      
      if (changes) {
        const changesSummary = getChangesSummary(pkg);
        changesSummary.forEach(change => {
          console.log(`   • ${change}`);
        });
      }
      console.log('');
    });
    break;
    
  case 'bump':
    if (!bumpType || !['major', 'minor', 'patch'].includes(bumpType)) {
      console.error('❌ Usage: node version-manager.js bump <major|minor|patch> [package-name]');
      console.error('   Examples:');
      console.error('     node version-manager.js bump patch                    # Bump all packages');
      console.error('     node version-manager.js bump minor shared            # Bump only shared package');
      process.exit(1);
    }
    
    const packagesToUpdate = specificPackage 
      ? packages.filter(pkg => pkg.includes(specificPackage))
      : packages.filter(pkg => hasChanges(pkg));
    
    if (packagesToUpdate.length === 0) {
      console.log('✅ No packages need version updates');
      break;
    }
    
    console.log(`🚀 Bumping ${bumpType} version for packages with changes:\n`);
    
    packagesToUpdate.forEach(pkg => {
      const fullPath = path.join(rootDir, pkg);
      const currentVersion = getCurrentVersion(fullPath);
      const newVersion = bumpVersion(currentVersion, bumpType);
      updateVersion(fullPath, newVersion);
    });
    
    console.log(`\n✅ Version bump complete! Run 'git commit' to save changes.`);
    break;
    
  case 'sync':
    // Sync all packages to the same version
    const referenceVersion = getCurrentVersion(path.join(rootDir, 'packages/shared'));
    console.log(`🔄 Syncing all packages to shared version: ${referenceVersion}\n`);
    
    packages.forEach(pkg => {
      const fullPath = path.join(rootDir, pkg);
      updateVersion(fullPath, referenceVersion);
    });
    
    console.log('✅ All packages synced to same version');
    break;
    
  case 'set':
    const targetVersion = bumpType; // Reuse parameter for version
    if (!targetVersion || !/^\d+\.\d+\.\d+$/.test(targetVersion)) {
      console.error('❌ Usage: node version-manager.js set <version> [package-name]');
      console.error('   Example: node version-manager.js set 1.2.3');
      process.exit(1);
    }
    
    const packagesToSet = specificPackage
      ? packages.filter(pkg => pkg.includes(specificPackage))
      : packages;
    
    console.log(`🎯 Setting version ${targetVersion} for selected packages:\n`);
    
    packagesToSet.forEach(pkg => {
      const fullPath = path.join(rootDir, pkg);
      updateVersion(fullPath, targetVersion);
    });
    
    console.log('✅ Version set complete!');
    break;
    
  default:
    console.log('📦 EGW Writings Version Manager\n');
    console.log('Commands:');
    console.log('  status                           Show version status for all packages');
    console.log('  bump <major|minor|patch> [pkg]   Bump version for packages with changes');
    console.log('  sync                             Sync all packages to shared version');
    console.log('  set <version> [pkg]              Set specific version');
    console.log('');
    console.log('Examples:');
    console.log('  node version-manager.js status');
    console.log('  node version-manager.js bump patch');
    console.log('  node version-manager.js bump minor shared');
    console.log('  node version-manager.js sync');
    console.log('  node version-manager.js set 1.2.3');
    break;
}