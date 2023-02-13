const fs = require('fs')
const { Storage } = require('@google-cloud/storage');
import PDF2JSON from "pdf2json";



const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {


        const { stream } = req.body;

        const pdf = await getPdf();
        const pdfJson = await convertPdfToJson(pdf);

        const textElements = extractTextElements(pdfJson);

        res.status(200).json({ textElements });
    }
};

export default handler;


async function getPdf() {
    // Creates a client
    const storage = new Storage();

    // The name of the bucket that contains the file
    const bucketName = 'crm-vagabond';
    // The name of the file
    const fileName = '51502997125.pdf';

    // Gets the file from the bucket
    const [file] = await storage.bucket(bucketName).file(fileName).download();

    return file;
}



async function convertPdfToJson(pdf) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDF2JSON();
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfData));
        pdfParser.parseBuffer(pdf);
    });
}

function extractTextElements(pdfJson) {
    const textElements = [];
    pdfJson?.Pages?.forEach(page => {
        page.Texts.forEach(text => {
            textElements.push(text.R[0].T);
        });
    });
    return textElements;
}
