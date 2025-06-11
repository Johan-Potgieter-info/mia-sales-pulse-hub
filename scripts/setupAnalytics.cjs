const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'analytics', 'documents');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
  console.log(`Created analytics documents directory at ${docsDir}`);
} else {
  console.log(`Analytics documents directory already exists at ${docsDir}`);
}
