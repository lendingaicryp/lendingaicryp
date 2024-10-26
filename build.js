const shell = require('shelljs');

// Create build directory
shell.mkdir('-p', 'build');

// Copy files to build directory
shell.cp('-R', ['index.html', 'assets', 'favicon.svg'], 'build/');

console.log('Build completed successfully!');