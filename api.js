require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

const {
    createRenderJobConfig,
    installFontFromAws,
} = require("./helpers/render");
const { checkAllowedUrls, validateRenderRequest } = require("./middlewares");

const app = express();
app.use(bodyParser.json());
// app.use(checkAllowedUrls);

const NEXRENDER_API_URL = "http://localhost:3050/api/v1/jobs";

app.post("/install-font", async (req, res) => {
    const { font_url: fontUrl } = req.body;

    try {
        const fontPath = await installFontFromAws(fontUrl);

        res.json({ message: "Font installed successfully!", fontPath });
    } catch (error) {
        console.error("Error installing font:", error);
        res.status(500).json({ error: "Failed to install font" });
    }
});

app.post("/create-render", validateRenderRequest, async (req, res) => {
    const jobId = uuidv4();
    const {
        template_uri: templateUri,
        composition_name: compositionName,
        assets,
        priority = 0,
    } = req.body;

    try {
        const renderJob = createRenderJobConfig(
            templateUri,
            compositionName,
            assets,
            jobId,
            priority
        );

        console.log("Sending render job");

        const response = await fetch(NEXRENDER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "nexrender-secret": process.env.SECRET,
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
                    "nexrender-secret": process.env.SECRET,
                },
            }
        );
        const jobData = await response.json();

        if (jobData.state === "finished") {
            const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${jobData.actions.postrender[1].params.key}`;
            delete jobData.actions.postrender[1].params;
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
                "nexrender-secret": process.env.SECRET,
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
                    "nexrender-secret": process.env.SECRET,
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
app.listen(port, "0.0.0.0", () => {
    console.log(`API server running on port ${port}`);
});
