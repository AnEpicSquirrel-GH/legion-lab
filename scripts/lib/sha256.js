// Re-export Node built-in for SHA-256 (used by csp-hashes.js only)
module.exports = require('crypto').createHash;
