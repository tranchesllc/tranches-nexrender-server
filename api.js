require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const currentPath = process.cwd();
const assets_uri = `file:///${currentPath}/uploads/assets`;


const app = express();
app.use(bodyParser.json());

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

app.post('/create-render', async (req, res) => {
    const jobId = uuidv4();
    // const reqBody = req.body;
    // const assets = reqBody.assets;
    // const templateUri = reqBody.template_uri;
    // const compositionName = reqBody.compositionName;

    const renderJob = {
        template: {
            src: "https://bposeats-static.s3.amazonaws.com/client-query-proposal-files/yNHQenYKrkJf88VjaWj4Pb",
            composition: "render",
        },
        assets: [
            {
                type: "data",
                layerName: "replace_Company_Name",
                property: "Source Text",
                value: "Wrytopia",
                composition: "text variables"
            },
            {
                type: "data",
                layerName: "replace_Client_Last_Name",
                property: "Source Text",
                value: "Sagrado",
                composition: "text variables"
            },
            {
                type: "data",
                layerName: "replace_Client_First_Name",
                property: "Source Text",
                value: "Sheldon",
                composition: "text variables"
            },
            {
                type: "image",
                layerName: "replace_Video_Intro",
                src: `${assets_uri}/images/sample-vid.mp4`
            },
            {
                type: "image",
                layerName: "replace_Video_Main",
                src: `${assets_uri}/images/sample-vid.mp4`
            },
            {
                type: "image",
                layerName: "replace_Logo_Company_Samples",
                src: `${assets_uri}/images/logo-sample.png`
            },
            {
                type: "image",
                layerName: "replace_Logo_Company_Intro",
                src: `${assets_uri}/images/logo-sample.png`
            },
            {
                type: "image",
                layerName: "replace_Logo_Company_Outro",
                src: `${assets_uri}/images/logo-sample.png`
            },
            {
                type: "image",
                layerName: "replace_Logo_Company_Sample_1",
                src: `${assets_uri}/images/logo-sample.png`
            },
            {
                type: "image",
                layerName: "replace_Logo_Company_Sample_1",
                src: `${assets_uri}/images/logo-sample.png`
            },
            {
                type: "image",
                layerName: "replace_Image_Sample_1",
                src: `${assets_uri}/images/grass.jpeg`
            },
            {
                type: "image",
                layerName: "replace_Image_Sample_2",
                src: `${assets_uri}/images/grass.jpeg`
            },
            {
                type: "image",
                layerName: "replace_Image_Sample_3",
                src: `${assets_uri}/images/grass.jpeg`
            },
            {
                type: "image",
                layerName: "jamie dimon.jpg",
                src: `${assets_uri}/images/jamie dimon.jpg`
            },
            {
                type: "image",
                layerName: "warren buffett.jpg",
                src: `${assets_uri}/images/warren buffett.jpg`
            },
            {
                type: "image",
                layerName: "ray dalio.jpg",
                src: `${assets_uri}/images/ray dalio.jpg`
            },
            // Uncomment the lines below to include additional images
            // {
            //     type: "image",
            //     layerName: "rock-staar-NzIV4vOBA7s-unsplash.jpg",
            //     src: `${project_assets_uri}/images/rock-staar-NzIV4vOBA7s-unsplash.jpg`,
            // },
            // {
            //     type: "image",
            //     layerName: "pexels-savvas-stavrinos-270619-814544.jpg",
            //     src: `${project_assets_uri}/images/pexels-savvas-stavrinos-270619-814544.jpg`,
            // },
            // {
            //     type: "image",
            //     layerName: "pexels-apasaric-325185.jpg",
            //     src: `${project_assets_uri}/images/pexels-apasaric-325185.jpg`,
            // },
            // {
            //     type: "image",
            //     layerName: "paul-skorupskas-7KLa-xLbSXA-unsplash.jpg",
            //     src: `${project_assets_uri}/images/paul-skorupskas-7KLa-xLbSXA-unsplash.jpg`,
            // },
            // {
            //     type: "image",
            //     layerName: "noah-windler-gQI8BOaL69o-unsplash.jpg",
            //     src: `${project_assets_uri}/images/noah-windler-gQI8BOaL69o-unsplash.jpg`,
            // },
            // {
            //     type: "image",
            //     layerName: "lukas-blazek-mcSDtbWXUZU-unsplash.jpg",
            //     src: `${project_assets_uri}/images/lukas-blazek-mcSDtbWXUZU-unsplash.jpg`,
            // },
            // {
            //     type: "image",
            //     layerName: "john-schnobrich-FlPc9_VocJ4-unsplash.jpg",
            //     src: `${project_assets_uri}/images/john-schnobrich-FlPc9_VocJ4-unsplash.jpg`,
            // },
            // {
            //     type: "image",
            //     layerName: "erika-fletcher-GJwgw_XqooQ-unsplash.jpg",
            //     src: `${project_assets_uri}/images/erika-fletcher-GJwgw_XqooQ-unsplash.jpg`,
            // },
        ],
        actions: {
            postrender: [
                {
                    module: '@nexrender/action-encode',
                    preset: 'mp4',
                    output: `output-${jobId}.mp4`
                },
                {
                    module: '@nexrender/action-upload',
                    provider: 's3',
                    params: {
                        bucket: process.env.S3_BUCKET_NAME,
                        key: `renders/output-${jobId}.mp4`,
                        acl: 'public-read',
                        region: process.env.AWS_REGION,
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                    }
                }
            ]
        }
    };

    try {
        console.log('Sending render job:', JSON.stringify(renderJob, null, 2));

        const response = await fetch('http://localhost:3050/api/v1/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'nexrender-secret': process.env.NEXRENDER_SECRET
            },
            body: JSON.stringify(renderJob)
        });

        const text = await response.text();
        console.log('Response from server:', text);

        const jobData = JSON.parse(text);

        res.json({
            message: 'Render job created successfully!',
            jobId: jobData.uuid
        });
    } catch (error) {
        console.error('Error creating render job:', error);
        res.status(500).json({ error: 'Failed to create render job' });
    }
});

app.get('/jobs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`http://localhost:3050/api/v1/jobs/${id}`, {
            headers: {
                'nexrender-secret': process.env.NEXRENDER_SECRET
            }
        });
        const jobData = await response.json();

        if (jobData.state === 'finished') {
            const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/renders/output-${id}.mp4`;
            res.json({ jobData: jobData, s3Url });
        } else {
            res.json({ jobData: jobData });
        }
    } catch (error) {
        console.error('Error fetching job status:', error);
        res.status(500).json({ error: 'Failed to fetch job status' });
    }
});

app.get('/jobs', async (req, res) => {
    try {
        const response = await fetch('http://localhost:3050/api/v1/jobs', {
            headers: {
                'nexrender-secret': process.env.NEXRENDER_SECRET
            }
        });
        const jobs = await response.json();

        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

app.delete('/jobs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`http://localhost:3050/api/v1/jobs/${id}`, {
            method: 'DELETE',
            headers: {
                'nexrender-secret': process.env.NEXRENDER_SECRET
            }
        });

        const text = await response.text();
        console.log('Response from server:', text);

        res.json({ message: 'Job deleted successfully!' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API server running on port ${port}`);
});