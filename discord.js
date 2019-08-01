const request = require('request-promise');
const airtable = require('airtable');

exports.discord = async (pubSubEvent, context) => {

    const allowedSubreddits = JSON.parse(process.env.allowedSubreddits);
    const body = await request.get(process.env.redditFeed);

    const posts = JSON.parse(body).data.children.map(post => post.data);
    const {title, url, subreddit, author, permalink} = posts.filter(post => allowedSubreddits.includes(post.subreddit) && post.name.startsWith('t3'))[0];

    if(process.env.airtableKey && process.env.airtableBase) {
        const base = new airtable({apiKey: process.env.airtableKey}).base(process.env.airtableBase);
        await base(process.env.airtableTableName || 'Discord').create({ Date: new Date(), title, subreddit, author, link: `www.reddit.com${permalink}` });
    }

    const packet = { username: process.env.discordUsername, content: url };

    await request.post({
        headers: {'Content-type': 'application/json'},
        url: process.env.discordHook,
        body: JSON.stringify(packet)
    });

    return "success";
}

if (require.main === module) {
    require('dotenv').config();
    exports.discord().then(console.log).catch(console.error);
}