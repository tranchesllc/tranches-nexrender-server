require('dotenv').config();

const { start } = require('@nexrender/worker')

const main = async () => {
    const serverHost = 'http://localhost:3050'
    const serverSecret = process.env.NEXRENDER_SECRET

    await start(serverHost, serverSecret, {
        tagSelector: false,
        addLicense: false,
        debug: true,
        onRenderProgress: function(job) {
            console.log('render progress:', job.uid, job.state, job.progress);
        },
        onRenderError: function(job, err) {
            console.log('render error:', job.uid, err);
        },
        onFinished: function(job) {
            console.log('render finished:', job.uid);
        },
        onError: function(job, err) {
            console.log('render error:', job.uid, err);
        },
    })
}

main().catch(console.error);