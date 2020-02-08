const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const unzipper = require('unzipper');

const {
    name,
    version,
    outputPath,
    releaseUrl,
    fileName
} = require('./config');

// Downloads the page and return the version if found
async function getReleaseInfo(page = 1) {
    const headers = { 'User-Agent': `${name}-v${version}`, Accept: 'application/json' };
    const releases = await request({ 
        url: `${releaseUrl}?page=${page}&per_page=10`,
        headers, 
        json: true 
    });

    if (releases.length === 0) {
        throw new Error(`Unable to find a release version for ${version}`);
    }

    return releases.find(({tag_name}) => tag_name === `v${version}`);
}

// Installer for set of tools
async function install() {
    const extractDir = path.join(outputPath, name);
    if (fs.existsSync(extractDir)) {
        return;
    }
    console.log(`Installing ${name}-v${version}`);
    
    let info, page = 1;
    do { info = await getReleaseInfo(page); }
    while( !info && page++ );

    const assets = (info.assets || []).filter(
        item =>
            item.content_type === 'application/zip' &&
            item.name === fileName,
    );
    if (assets.length !== 1) {
        throw new Error(`Unable to locate the download ${fileName}.`);
    }

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    const [{ browser_download_url: url }] = assets;
    const zipPath = path.join(outputPath, fileName);

    const headers = { 'User-Agent': `${name}-v${version}`, Accept: 'application/zip' };
    const zipfile = await request({ url, headers, json: false, encoding: null });
    const buffer = Buffer.from(zipfile, 'utf8');
    fs.writeFileSync(zipPath, buffer);

    const extractor = unzipper.Extract({ path: extractDir });
    const completion = new Promise((res, rej) => {
        extractor.on('close', res);
        extractor.on('error', rej);
    });

    fs.createReadStream(zipPath).pipe(extractor);
    await completion;
}

// Run
install()
    .then(() => process.exit(0))
    .catch(ex => {
        console.dir(ex, { depth: 1 });
        process.exit(1);
    });
