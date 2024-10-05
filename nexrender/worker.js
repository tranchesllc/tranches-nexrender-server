require('dotenv').config();

const { start } = require('@nexrender/worker');

start({
    host: 'http://localhost:3050', 
    secret: process.env.NEXRENDER_SECRET,
    workerId: 'worker1',
    download: { threads: 2 },
    upload: { threads: 2 },
    // binary: "U:\\Program Files\\Adobe After Effects 2024\\Support Files\\aerender.exe",
})
    .then(() => console.log('Nexrender worker is running'))
    .catch(console.error);