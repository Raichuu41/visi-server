import fs from 'fs';
import sharp from 'sharp';
import sizes from '../config/imgSizes.js';
import dataSets from '../config/datasets.js';
import { maxNodesCount } from '../config/maxNodesCount.js';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fsp = fs.promises;

const buildDatasets = async (imgSizes) => {
    console.log('Start building byte files');
    console.time('buildDatasets');
    // const timeResizePics = process.hrtime();

    // for each dataset
    const l = dataSets.length;
    for (let d = 0; d < l; d += 1) {
        try {
            // absolute source of images
            const { id, imgPath } = dataSets[d];
            // check if path to source exists
            if (!fs.existsSync(imgPath)) throw new Error(`Path to images (source) invalid: ${imgPath}`);

            // create dataset name
            const datasetName = dataSets[d].name;
            // max dataset size
            const count = dataSets[d].size > maxNodesCount ? maxNodesCount : dataSets[d].size;
            console.log(`Dataset: ${id} Count: ${count} Path: ${imgPath}`);
            console.log('------------------------------------------');

            // create path if not existing
            const outPath = path.join(__dirname, '../../images/bin/');
            if (!fs.existsSync(outPath)) fs.mkdirSync(outPath);

            //  JSON files with nodes
            const jsonFileName = `${datasetName}.json`;
            const jsonFilePath = path.join(
                __dirname,
                '../../images/',
                jsonFileName,
            );
            console.log(jsonFilePath);
            const jsonFile = await fsp.readFile(jsonFilePath);
            console.log(jsonFile.data);
            const { nodes } = JSON.parse(jsonFile.data);
            console.log(nodes);
            const sortedNodes = {};
            Object.keys(nodes).forEach((name) => {
                sortedNodes[nodes[name].idx] = name;
            });

            const sourceFiles = Object.values(sortedNodes);
            let wstream;

            console.log(`start building dataset for ${count} pics`);

            // map through files
            for (let i = 0; i < count; i += 1) {
                if (i % 500 === 0) {
                    if (wstream) wstream.end();
                    // prepare write stream
                    const number = i + 500 < count ? i + 500 : count;
                    const binFileName = `${datasetName}#${number}.bin`;
                    const binFilePath = path.join(outPath, binFileName);
                    console.log(`binFilePath: ${binFilePath}`);
                    if (fs.existsSync(binFilePath)) {
                        console.log(`bin file already exists for dataset: ${datasetName} - delete the file for recreating the dataset`);
                        // procede with the next dataset
                        i += 499;
                        continue;
                    }
                    wstream = fs.createWriteStream(binFilePath);
                }
                const file = sourceFiles[i];
                // console.log(imgPath, file);

                let imgFilePath;
                // test the file extension -
                try {
                    imgFilePath = fs.realpathSync(path.join(imgPath, `${file}.jpg`));
                } catch (e) {
                    // nothing to because file is maybe a .png and next try will error if file not exists
                    try {
                        if (!imgFilePath) imgFilePath = fs.realpathSync(path.join(imgPath, `${file}.png`));
                    } catch (e) {
                        try {
                            imgFilePath = fs.realpathSync(path.join(imgPath, file));
                        } catch (e) {
                            console.error('Error Loading img - check path:');
                            console.log(imgPath, file, imgFilePath);
                            throw e;
                        }
                    }
                }

                if (!(i % 10)) console.log(`${i}: ${imgFilePath}`);

                const pics = Object.create(null);
                try {
                    await Promise.all(imgSizes.map(async (size) => {
                        pics[size] = await sharp(imgFilePath)
                            .resize(size, size, { fit: 'inside' })
                            .ensureAlpha()
                            .raw()
                            .toBuffer({ resolveWithObject: true });
                    }));
                } catch (e) {
                    console.error(e);
                    console.error(`exists?: ${fs.existsSync(imgFilePath)}`, imgFilePath);
                    console.error(fs.statSync(imgFilePath));
                    console.log(parsed);
                }

                Object.values(pics).forEach((p) => {
                    if (p) {
                        wstream.write(Buffer.from([p.info.width, p.info.height]));
                        wstream.write(p.data);
                    }
                });
            }
            if (wstream) {
                wstream.end();
                wstream.on('finish', () => {
                    console.log('All writes are now complete.');
                    console.log(wstream.path);
                });
            }
        } catch (err) {
            console.error(err);
            if (err) throw new Error(err);
        }
    }
    console.timeEnd('buildDatasets');
};

export default buildDatasets;

buildDatasets(sizes)
    .then(() => console.log('Finished: all images resized'))
    .catch((err) => {
        console.error('Error: resizePics not finished');
        console.error(err.message);
        console.error(err);
    });
