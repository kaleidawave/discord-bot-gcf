# Discord 

A [google cloud function](https://cloud.google.com/functions/) which programmatically collects a post from a reddit feed and posts it to a discord channel via [discord webhooks](https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks). The function can then be hooked up to [cloud scheduler](https://cloud.google.com/scheduler/docs/quickstart).


### Usage

Running locally:

```
npm start
```

*include a `.env` file with your environment variables*

Deploy to GCP:

```
npm run deploy
```

### Reddit Feed:

The function requires a reddit feed json endpoint. This could be a specific subreddit (e.g. `https://www.reddit.com/r/vuejs.json`), a user profile (e.g. `https://www.reddit.com/user/nasa.json`) or a [saved feed](https://www.reddit.com/prefs/feeds/).

### Environment Variables:

The function uses environment variable to configure the function

`allowedSubreddits` a list of strings of subreddit names that posts can be from.

`discordUsername` the username of the discord bot

`redditFeed` the url of a reddit feed 

`discordHook` the url of the discord webhook

*Airtable Logging (Optional)*

`airtableKey` your airtable api key (obtained in the account page)

`airtableBase` your airtable base key (not sure how you obtain )
