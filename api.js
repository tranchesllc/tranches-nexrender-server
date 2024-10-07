require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

// const currentPath = process.cwd();
// const assets_uri = `file:///${currentPath}/uploads/assets`;

const app = express();
app.use(bodyParser.json());

// Constants
const REQUIRED_FIELDS = ["assets", "template_uri", "composition_name"];
const NEXRENDER_API_URL = "http://localhost:3050/api/v1/jobs";

// Middleware for validation
const validateRenderRequest = (req, res, next) => {
    console.log("Request body:", req.body);
    const missingFields = REQUIRED_FIELDS.filter((field) => {
        const value = req.body[field];
        return !value;
    });

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: "Missing required fields",
            missingFields,
        });
    }
    next();
};

// Helper function to create render job configuration
const createRenderJobConfig = (
    templateUri,
    compositionName,
    assets,
    jobId
) => ({
    template: {
        src: templateUri,
        composition: compositionName,
    },
    assets: typeof assets === "string" ? JSON.parse(assets) : assets,
    actions: {
        postrender: [
            {
                module: "@nexrender/action-encode",
                preset: "mp4",
                output: `output-${jobId}.mp4`,
            },
            {
                module: "@nexrender/action-upload",
                provider: "s3",
                params: {
                    bucket: process.env.S3_BUCKET_NAME,
                    key: `renders/output-${jobId}.mp4`,
                    region: process.env.AWS_REGION,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            },
        ],
    },
});

app.post("/create-render", validateRenderRequest, async (req, res) => {
    const jobId = uuidv4();
    const {
        template_uri: templateUri,
        composition_name: compositionName,
        assets,
    } = req.body;

    try {
        const renderJob = createRenderJobConfig(
            templateUri,
            compositionName,
            assets,
            jobId
        );

        console.log("Sending render job:", JSON.stringify(renderJob, null, 2));

        const response = await fetch(NEXRENDER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "nexrender-secret": process.env.NEXRENDER_SECRET,
            },
            body: JSON.stringify(renderJob),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jobData = await response.json();

        return res.json({
            message: "Render job created successfully!",
            jobId: jobData.uid,
        });
    } catch (error) {
        console.error("Error creating render job:", error);
        return res.status(500).json({
            error: "Failed to create render job",
            details:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
});

app.get("/jobs/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(
            `http://localhost:3050/api/v1/jobs/${id}`,
            {
                headers: {
                    "nexrender-secret": process.env.NEXRENDER_SECRET,
                },
            }
        );
        const jobData = await response.json();

        if (jobData.state === "finished") {
            const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${jobData.actions.postrender[1].params.key}`;
            res.json({ jobData: jobData, s3Url });
        } else {
            res.json({ jobData: jobData });
        }
    } catch (error) {
        console.error("Error fetching job status:", error);
        res.status(500).json({ error: "Failed to fetch job status" });
    }
});

app.get("/jobs", async (req, res) => {
    try {
        const response = await fetch("http://localhost:3050/api/v1/jobs", {
            headers: {
                "nexrender-secret": process.env.NEXRENDER_SECRET,
            },
        });
        const jobs = await response.json();

        res.json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

app.delete("/jobs/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(
            `http://localhost:3050/api/v1/jobs/${id}`,
            {
                method: "DELETE",
                headers: {
                    "nexrender-secret": process.env.NEXRENDER_SECRET,
                },
            }
        );

        const text = await response.text();
        console.log("Response from server:", text);

        res.json({ message: "Job deleted successfully!" });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ error: "Failed to delete job" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API server running on port ${port}`);
});
