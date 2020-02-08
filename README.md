# protoc-tools

NPM package for installing protoc command-line tools for osx and linux

Usage:

```
npm install protoc-tools
```

Once installed, `protoc` will be installed to `node_modules/.bin/protoc` and can be used normally from npm scripts in the associated package.json file.

This tool install _should_ support mac/osx and linux in both 32-bit and 64-bit environments.

## What happens...

The npm package will download the release associated with the version of `protoc-tools` installed from the following location:

* https://github.com/protocolbuffers/protobuf/releases

This package will attempt to identify the correct download zip and extract the files at install time.
