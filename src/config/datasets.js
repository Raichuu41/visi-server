/*
   {
        id: String, unique id
        name: String, Name that is shown to the user
        description: String, also shown to the user
        imgPath: String, absolute path to dicts
        mockDataFile: String, path to mock file
        count: Number, use only if want to reduce the dataset to the first n elements. Most time creating a new one is the bedder way
    }
 */
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataSet = [
    {
        id: '099',
        name: '2582_sub_wikiarts_debug',
        description: '...',
        imgPath: path.join(__dirname, '../../images/2582_sub_wikiarts_debug'),
        size: 4,
    },
/*    {
        id: '001',
        name: 'Wikiart_Elgammal_EQ_style_train',
        description: 'description text missing',
        imgPath: '/net/hcihome/storage/www-data-login-cv/visiexp/datasets/raw/Wikiart_Elgammal/',
        size: 6336,

     }
 */
];

export default dataSet;

