import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import sizes from '../config/imgSizes';
import dataSets from '../config/datasets';

const fsp = fs.promises;

const buildDatasets = async (imgSizes) => {
    console.time('buildDatasets');
    // const timeResizePics = process.hrtime();

    const l = dataSets.length;
    for (let d = 0; d < l; d += 1) {
        try {
            // absolute source of images
            const inImgPath = dataSets[d].imgPath;
            if (!fs.existsSync(inImgPath)) throw new Error(`Path to images (source) invalid: ${inImgPath}`);
            console.log({ inImgPath });

            const sourceFiles = await fsp.readdir(inImgPath);
            const datasetName = dataSets[d].name;
            const count = dataSets[d].count || sourceFiles.length;

            const outPath = path.join(__dirname, '../../images/bin/');
            if (!fs.existsSync(outPath)) fs.mkdirSync(outPath);
            const binFileName = `${datasetName}#${count}.bin`;
            const binFilePath = path.join(outPath, binFileName);
            console.log({ binFilePath });
            if (fs.existsSync(binFilePath)) {
                console.log(`bin file allready exists for dataset: ${datasetName} - delete the file for recreating the dataset`);
                continue;
            }
            const wstream = fs.createWriteStream(binFilePath);

            console.log(`start building dataset for ${count} pics`);

            // map through files
            for (let i = 0; i < count; i += 1) {
                const file = sourceFiles[i];
                const imgFilePath = fs.realpathSync(path.join(inImgPath, file));
                console.log(`${i}: ${imgFilePath}`);

                // console.log(`check: ${sourceImagePath}`);
                // try {
                //     fs.accessSync(sourceImagePath, fs.constants.F_OK);
                //     console.log('file exists');
                //     fs.accessSync(sourceImagePath, fs.constants.R_OK);
                //     console.log('can read');
                //     fs.accessSync(sourceImagePath, fs.constants.W_OK);
                //     console.log('can write');
                // } catch (err) {
                //     console.error('no access!');
                //     console.error(err);
                //     return;
                // }
                const pics = Object.create(null);
                await Promise.all(imgSizes.map(async (size) => {
                    pics[size] = await sharp(imgFilePath)
                        .resize(size, size, { fit: 'inside' })
                        .ensureAlpha()
                        .raw()
                        .toBuffer({ resolveWithObject: true })
                        .catch((e) => {
                            console.log(imgFilePath);
                            console.log(`exists?: ${fs.existsSync(imgFilePath)}`);
                            throw Error(e);
                        });
                }));


                Object.values(pics).forEach((p) => {
                    wstream.write(Buffer.from([p.info.width, p.info.height]));
                    wstream.write(p.data);
                    // console.log(p.info.width, p.info.height, p.data.length);
                });
            }
            wstream.end();
            wstream.on('finish', () => {
                console.log('All writes are now complete.');
                console.log(wstream.path);
            });
        } catch (err) {
            console.error(err);
            if (err) throw new Error(err);
        }
    }
    console.timeEnd('buildDatasets');
};


export default buildDatasets;

buildDatasets(sizes).then((e) => {
    console.log('Finished: all images resized');
}).catch((err) => {
    console.error('Error: resizePics not finished');
    console.error(err.message);
    console.error(err);
});