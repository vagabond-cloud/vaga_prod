/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = 'vagabond-331916';
const location = 'europe-west3';
const agentId = '635b888e-747c-4803-9786-941d01de1f72';
// const query = 'Hello';
const languageCode = 'en'

// Imports the Google Cloud Some API library
const { SessionsClient } = require('@google-cloud/dialogflow-cx');
/**
 * Example for regional endpoint:
 *   const location = 'us-central1'
 *   const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com'})
 */
const client = new SessionsClient({ apiEndpoint: 'europe-west3-dialogflow.googleapis.com' });


const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {
        const { query } = req.body;
        const intend = await detectIntentText(query);
        return res.status(200).json({ intend });
    } else {
        return res.status(404).json({ error: 'Not found' });
    }
}

export default handler;

async function detectIntentText(query) {
    const sessionId = Math.random().toString(36).substring(7);
    const sessionPath = client.projectLocationAgentSessionPath(
        projectId,
        location,
        agentId,
        sessionId
    );
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
            },
            languageCode,
        },
    };
    const [response] = await client.detectIntent(request);
    for (const message of response.queryResult.responseMessages) {
        if (message.text) {
            console.log(`Agent Response: ${message.text.text}`);
            return message.text.text
        }
    }
    if (response.queryResult.match.intent) {
        console.log(
            `Matched Intent: ${response.queryResult.match.intent.displayName}`
        );
    }
    console.log(
        `Current Page: ${response.queryResult.currentPage.displayName}`
    );

}

