import { IncomingForm } from 'formidable'
const { Storage } = require('@google-cloud/storage');
import { v4 as uuidv4 } from 'uuid';

const bucketName = 'crm-vagabond';
const storage = new Storage();
const generationMatchPrecondition = 0;

const uuid = uuidv4();

export const config = {
    api: {
        bodyParser: false,

    }
};

const handler = async (req, res) => {
    const { method } = req;

    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, async (err, fields, files) => {
            if (err) return reject(err)

            await storage
                .bucket(bucketName)
                .upload(files?.file?.filepath, { destination: uuid })

            await storage
                .bucket(bucketName)
                .file(uuid)
                .setMetadata(
                    {
                        contentType: files.file.mimetype,
                        contentLanguage: 'en',
                        contentEncoding: 'compress',
                        contentDisposition: 'inline',
                        cacheControl: 'public, max-age=31536000',
                        // A note or actionable items for user e.g. uniqueId, object description,
                        // or other useful information.
                        metadata: {
                            lastModified: files.file.lastModifiedDate,
                            originalFileName: files.file.originalFilename,

                        },
                    })

            const fileUrl = ` https://storage.googleapis.com/crm-vagabond/${uuid}`

            res.status(200).json({ data: { fileUrl } });
        })

    })

}


export default handler;



