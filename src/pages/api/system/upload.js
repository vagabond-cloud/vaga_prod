import { IncomingForm } from 'formidable';
const { Storage } = require('@google-cloud/storage');
import { v4 as uuidv4 } from 'uuid';

const bucketName = 'crm-vagabond';
const storage = new Storage();
const generationMatchPrecondition = 0;
const uuid = uuidv4();
export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req, res) => {
    const { method } = req;
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) return reject(err);

            const { file } = files;
            if (!file) return reject(new Error('File not found in the request'));
            try {
                await storage.bucket(bucketName).upload(file.filepath, { destination: uuid });
                await storage
                    .bucket(bucketName)
                    .file(uuid)
                    .setMetadata({
                        contentType: file.mimetype,
                        contentLanguage: 'en',
                        contentEncoding: 'compress',
                        contentDisposition: 'inline',
                        cacheControl: 'public, max-age=31536000',
                        metadata: {
                            lastModified: file.lastModifiedDate,
                            originalFileName: file.originalFilename,
                        },
                    });

                const fileUrl = `https://storage.googleapis.com/crm-vagabond/${uuid}}`;

                res.status(200).json({ data: { fileUrl } });
            } catch (err) {
                console.log(err)
                res.status(500).json({ error: err.message });
            }

        });
    });
};

export default handler;




