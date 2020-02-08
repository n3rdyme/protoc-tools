const path = require('path');
const { name, version } = require('./package.json');

// github project
const project = 'protocolbuffers/protobuf';

const platform = {
  darwin_x32: 'osx-x86_32',
  darwin_x64: 'osx-x86_64',
  linux_x32: 'linux-x86_32',
  linux_x64: 'linux-x86_64',
  // win32_x32: 'win32',
  // win32_x64: 'win64',
}[`${process.platform}_${process.arch === 'ia32' ? 'x32' : process.arch}`];

if (!platform) {
  throw new Error(`The platform "${process.platform}-${process.arch}" is not supported.`);
}

module.exports = {
    name, 
    version,
    outputPath: path.join(__dirname, 'tools'),
    releaseUrl: `https://api.github.com/repos/${project}/releases`,
    fileName: `protoc-${version}-${platform}.zip`,
};