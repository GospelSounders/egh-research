#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Function to update package.json dependencies from workspace:* to actual version
function updatePackageForPublish(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Get shared package version
  const sharedPackageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'packages/shared/package.json'), 'utf8'));
  const sharedVersion = sharedPackageJson.version;
  
  // Update workspace dependencies to published versions
  if (packageJson.dependencies && packageJson.dependencies['@surgbc/egw-writings-shared']) {
    packageJson.dependencies['@surgbc/egw-writings-shared'] = `^${sharedVersion}`;
  }
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Updated ${packagePath}/package.json - shared dependency: ^${sharedVersion}`);
}

// Update all packages (excluding website since it's private)
const packages = [
  'apps/api-server',
  'apps/downloader', 
  'apps/local-server',
  'packages/egw-pdf-generator'
];

packages.forEach(pkg => {
  updatePackageForPublish(path.join(rootDir, pkg));
});