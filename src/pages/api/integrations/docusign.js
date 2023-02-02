const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');



const handler = async (req, res) => {
    const { method } = req;



    if (method === 'POST') {

        const { title, description, action, ip } = req.body;

        const args = {
            accessToken: "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCApX5skwTbSAgAgOWhetYE20gCAHMXJJrWuT1PvAq8G8kBSxAVAAEAAAAYAAEAAAAFAAAADQAkAAAAOGUwYjY3NWQtNjJjNC00ZTI1LWI3MGQtN2RkZTgyNzBkYTQzIgAkAAAAOGUwYjY3NWQtNjJjNC00ZTI1LWI3MGQtN2RkZTgyNzBkYTQzMACAWbzdjwTbSDcA9PW9fHxTBkmDS3Rr-yYd_A.AbIVUXvft4ZAPDnQ6CbTzxm5wtGiEQ53DqG-2tz0CvBQbdrPvOyeIrg4EG4snYYeqLuecQ3lx_SRGhzNVu1hhnZXtcTDkt3VVDinydIw8yX9ke_AMXHT-q_3itwJLrYHFNmmyfcBCkgszeW5RmeAOtQ0yUfUaMcX7DLE-bFG9jUrtuOx4uMMxFGNy_abmwZHmBwsgTjEWoM4xmdZrsskUie5Lrl_CFIF80LTv00cD_XJiGJXnqS93hLMsp_WPH0OpQUVI4PYdg_CSDGbV8i-nWuev9lH-EcW4Ho6d7yDSQiLRdYiT-wz4gq-6vdq_gMSX2JG1GIRqlN1LUOHg05RiA",
            basePath: "https://demo.docusign.net/restapi/",
            accountId: "18254572",
            signerEmail: "navidkianil@gmail.com",
            signerName: "John Smith",
            ccEmail: "navid@trxf.net",
            ccName: "John Doe",
            envelopeArgs: {
                signerEmail: "navidkianil@gmail.com",
                signerName: "John Smith",
                ccEmail: "navid@trxf.net",
                ccName: "John Doe",
                status: "sent",
            }
        }

        let dsApiClient = new docusign.ApiClient();
        dsApiClient.setBasePath(args.basePath);
        dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
        let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
            results = null;

        // Make the envelope request body
        let envelope = makeEnvelope(args.envelopeArgs);

        // Call Envelopes::create API method
        // Exceptions will be caught by the calling function
        results = await envelopesApi.createEnvelope(args.accountId, {
            envelopeDefinition: envelope,
        });
        let envelopeId = results.envelopeId;

        console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
        res.status(200).json({ envelopeId: envelopeId });
        return { envelopeId: envelopeId };
    }
};

export default handler;

const demoDocsPath = path.join('/Users/navidlarijani/Downloads/');
const doc2File = "Receipt-2646-4803.pdf"
const doc3File = "Receipt-2646-4803.pdf"

function makeEnvelope(args) {

    let doc2DocxBytes, doc3PdfBytes;
    // read files from a local directory
    // The reads could raise an exception if the file is not available!
    doc2DocxBytes = fs.readFileSync(path.resolve(demoDocsPath, doc2File));
    doc3PdfBytes = fs.readFileSync(path.resolve(demoDocsPath, doc3File));

    // Create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = 'Please sign this document set';

    // add the documents
    let doc1 = new docusign.Document()
        , doc1b64 = Buffer.from(document1(args)).toString('base64')
        , doc2b64 = Buffer.from(doc2DocxBytes).toString('base64')
        , doc3b64 = Buffer.from(doc3PdfBytes).toString('base64')
        ;

    doc1.documentBase64 = doc1b64;
    doc1.name = 'Order acknowledgement'; // can be different from actual file name
    doc1.fileExtension = 'html'; // Source data format. Signed docs are always pdf.
    doc1.documentId = '1'; // a label used to reference the doc

    // Alternate pattern: using constructors for docs 2 and 3...
    let doc2 = new docusign.Document.constructFromObject({
        documentBase64: doc2b64,
        name: 'Battle Plan', // can be different from actual file name
        fileExtension: 'docx',
        documentId: '2'
    });

    let doc3 = new docusign.Document.constructFromObject({
        documentBase64: doc3b64,
        name: 'Lorem Ipsum', // can be different from actual file name
        fileExtension: 'pdf',
        documentId: '3'
    });

    // The order in the docs array determines the order in the envelope
    env.documents = [doc1, doc2, doc3];

    // create a signer recipient to sign the document, identified by name and email
    // We're setting the parameters via the object constructor
    let signer1 = docusign.Signer.constructFromObject({
        email: args.signerEmail,
        name: args.signerName,
        recipientId: '1',
        routingOrder: '1'
    });
    // routingOrder (lower means earlier) determines the order of deliveries
    // to the recipients. Parallel routing order is supported by using the
    // same integer as the order for two or more recipients.

    // create a cc recipient to receive a copy of the documents, identified by name and email
    // We're setting the parameters via setters
    let cc1 = new docusign.CarbonCopy();
    cc1.email = args.ccEmail;
    cc1.name = args.ccName;
    cc1.routingOrder = '2';
    cc1.recipientId = '2';

    // Create signHere fields (also known as tabs) on the documents,
    // We're using anchor (autoPlace) positioning
    //
    // The DocuSign platform searches throughout your envelope's
    // documents for matching anchor strings. So the
    // signHere2 tab will be used in both document 2 and 3 since they
    // use the same anchor string for their "signer 1" tabs.
    let signHere1 = docusign.SignHere.constructFromObject({
        anchorString: '**signature_1**',
        anchorYOffset: '10', anchorUnits: 'pixels',
        anchorXOffset: '20'
    })
        , signHere2 = docusign.SignHere.constructFromObject({
            anchorString: '/sn1/',
            anchorYOffset: '10', anchorUnits: 'pixels',
            anchorXOffset: '20'
        })
        ;

    // Tabs are set per recipient / signer
    let signer1Tabs = docusign.Tabs.constructFromObject({
        signHereTabs: [signHere1, signHere2]
    });
    signer1.tabs = signer1Tabs;

    // Add the recipients to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
        signers: [signer1],
        carbonCopies: [cc1]
    });
    env.recipients = recipients;

    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    env.status = args.status;

    return env;
}

/**
 * Creates document 1
 * @function
 * @private
 * @param {Object} args parameters for the envelope:
 *   <tt>signerEmail</tt>, <tt>signerName</tt>, <tt>ccEmail</tt>, <tt>ccName</tt>
 * @returns {string} A document in HTML format
 */

function document1(args) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family:sans-serif;margin-left:2em;">
        <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
            color: darkblue;margin-bottom: 0;">World Wide Corp</h1>
        <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
          margin-top: 0px;margin-bottom: 3.5em;font-size: 1em;
          color: darkblue;">Order Processing Division</h2>
        <h4>Ordered by ${args.signerName}</h4>
        <p style="margin-top:0em; margin-bottom:0em;">Email: ${args.signerEmail}</p>
        <p style="margin-top:0em; margin-bottom:0em;">Copy to: ${args.ccName}, ${args.ccEmail}</p>
        <p style="margin-top:3em;">
  Candy bonbon pastry jujubes lollipop wafer biscuit biscuit. Topping brownie sesame snaps sweet roll pie. Croissant danish biscuit soufflé caramels jujubes jelly. Dragée danish caramels lemon drops dragée. Gummi bears cupcake biscuit tiramisu sugar plum pastry. Dragée gummies applicake pudding liquorice. Donut jujubes oat cake jelly-o. Dessert bear claw chocolate cake gummies lollipop sugar plum ice cream gummies cheesecake.
        </p>
        <!-- Note the anchor tag for the signature field is in white. -->
        <h3 style="margin-top:3em;">Agreed: <span style="color:white;">**signature_1**/</span></h3>
        </body>
    </html>
  `
}