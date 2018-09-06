/*
*   1. eine Übersicht über jedes Datenset
*   2. eine Pfad zum Ort wo die Bilddateien liegen
*   3. in dev kann hier noch der
* */

const devDataSets = [
    {
        name: 'test-1 - 2582_sub_wikiarts',
        description: 'this contains X Nodes, Y datas, Z cliques, K ranks',
        pathToImgs: `${__dirname}/../../images/2582_sub_wikiarts/`,
        mockDataFile: '',
        count: 50,

    },
    {
        name: 'test-2',
        description: 'this contains X Nodes, Y datas, Z cliques, K ranks',
        pathToImgs: `${__dirname}/../../images/images_3000/`,
        mockDataFile: '',
        count: 100,
    },
    {
        name: 'test-3',
        description: 'this contains X Nodes, Y datas, Z cliques, K ranks',
        pathToImgs: `${__dirname}/../../images/2582_sub_wikiarts/`,
        mockDataFile: '',
    },

];


const prodDataSet = [
    {
        name: 'Katjs datensatz',
        description: 'this contains X Nodes, Y datas, Z cliques, K ranks',
        pathToImgs: `Kompletter pfad zu Bildern`,
    },
]

export const dataSet = process.env.NODE_ENV === 'production' ? prodDataSet : devDataSets;

