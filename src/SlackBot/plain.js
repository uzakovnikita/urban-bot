// Initialize using signing secret from environment variables
const { createEventAdapter } = require('@slack/events-api');
const { createMessageAdapter } = require('@slack/interactive-messages');
// const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const { WebClient } = require('@slack/web-api');
const SLACK_SIGNING_SECRET = '6f28eeba42717acfb2249c78e6a4b190';
const slackEvents = createEventAdapter(SLACK_SIGNING_SECRET);
const slackInteractions = createMessageAdapter(SLACK_SIGNING_SECRET);
const port = 8080;
// Initialize an express app
const app = require('express')();
const bodyParser = require('body-parser');

// const token = process.env.SLACK_TOKEN;
const token = 'xoxb-1067397452132-1061285523475-FYuXpydlFDZnhKHRghGKbg18';
const web = new WebClient(token);

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im

function handleMessage(event) {
    if (event.bot_id === undefined) {
        console.log(event);
        web.chat.postMessage({ channel: event.channel, text: event.text }).catch(console.log);
    }
}
slackEvents.on('message', handleMessage);
slackEvents.on('error', console.error);
app.use('/slack/events', slackEvents.expressMiddleware());

// Handle interactions from messages containing an action block with an `action_id` of `select_coffee`
slackInteractions.action({ callbackId: 'test' }, (payload, respond) => {
    console.log('slackInteractions', payload);
    // `payload` contains information about the action
    // Block Kit Builder can be used to explore the payload shape for various action blocks:
    // https://api.slack.com/tools/block-kit-builder

    // `respond` and return value are the same as above.
});
app.use('/slack/actions', slackInteractions.expressMiddleware());

function slackSlashCommand(req, res, next) {
    console.log(req.body);
    res.send();
    web.chat.postMessage({ channel: req.body.channel_id, text: req.body.text }).catch(console.log);
    next();
}
app.post('/slack/commands', bodyParser.urlencoded({ extended: false }), slackSlashCommand);

app.listen(port, () => {
    console.log('start listen ' + port);
});