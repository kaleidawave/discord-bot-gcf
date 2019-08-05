const airtable = require('airtable');
const moment = require('moment');

exports.discordUI = async (req, res) => {
    const auth = req.get("authorization");
    if (!auth) {
        res.set("WWW-Authenticate", "Basic realm=\"Authorization Required\"");
        res.status(401).send("Authorization Required");
    }
    else {
        const [username, password] = Buffer.from(auth.split(" ").pop(), "base64").toString("ascii").split(":");

        if (username === process.env.monitoringUsername && password === process.env.monitoringPassword) {
            const base = new airtable({apiKey: process.env.airtableKey}).base(process.env.airtableBase);
            const table = await base(process.env.airtableTableName || 'Discord').select({
                maxRecords: process.env.maxRecords || 3,
                view: "Grid view"
            }).all();

            res.send(`
                <title>${process.env.discordUsername} - Logs</title>
                <link rel="stylesheet" href="https://storage.googleapis.com/kaleidawave/discord/styles.css">
                <h1>Discord Logs:</h1>
                <p>Last ${table.length} runs</p>
                <table>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Subreddit</th>
                    </tr>
                    ${
                table.map(x => `
                            <tr>
                                <td><a href="https://${x.fields.link}">${x.fields.title}</a></td>
                                <td>${moment(x.fields.Date).fromNow()}</td>
                                <td>${x.fields.subreddit}</td>
                            </tr>
                        `).join('')
                }
                </table>
            `);
        }
        else {
            res.status(403).send("Access Denied (incorrect credentials)");
        }
    }
};

if (require.main === module) {
    require('dotenv').config();
    const app = require('express')();

    app.get('/', exports.discordUI);
    app.listen(8080, () => console.log('Listening on http://localhost:8080/'));
}