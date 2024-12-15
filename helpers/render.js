require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const createRenderJobConfig = (
    templateUri,
    compositionName,
    assets,
    jobId,
    priority
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
    priority: priority || 0,
});

// Helper function to download the font
async function downloadFont(fontUrl, destination) {
    const writer = fs.createWriteStream(destination);
    const response = await axios({
        url: fontUrl,
        method: "GET",
        responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}

// Function to install the font on the system and delete the local file
function installFont(fontPath) {
    const platform = process.platform;

    if (platform === "win32") {
        // For Windows - use reg command to properly install the font
        const fontName = path.basename(fontPath);
        const systemFontsPath = path.join(
            process.env.SYSTEMROOT,
            "Fonts",
            fontName
        );

        if (fs.existsSync(systemFontsPath)) {
            throw new Error("Already installed");
        }

        // Copy font file to Windows Fonts directory
        exec(
            `copy "${fontPath}" "${systemFontsPath}"`,
            (copyError, copyStdout, copyStderr) => {
                if (copyError) {
                    throw new Error(`Error copying font file: ${copyError}`);
                }

                // Add font registry entry
                const regCommand = `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts" /v "${fontName}" /t REG_SZ /d "${fontName}" /f`;

                exec(regCommand, (regError, regStdout, regStderr) => {
                    if (regError) {
                        throw new Error(
                            `Error adding font to registry: ${regError}`
                        );
                    } else {
                        console.log("Font installed successfully on Windows");
                    }
                });
            }
        );
    } else {
        throw new Error(
            "Platform not supported for automatic font installation."
        );
    }
}

// Main function to download and install the font
async function installFontFromAws(url) {
    const fontFileName = path.basename(url);
    const localFontPath = path.join(__dirname, fontFileName);

    try {
        console.log(`Downloading font from ${url}...`);
        await downloadFont(url, localFontPath);
        console.log("Font downloaded successfully.");

        installFont(localFontPath);
    } catch (error) {
        console.error("Error during font download or installation:", error);
    } finally {
        fs.unlink(localFontPath, () => {});
    }
}

async function installFonts(fontUrls) {
    for (const url of fontUrls) {
        await installFontFromAws(url);
    }
}

module.exports = {
    createRenderJobConfig,
    installFonts,
    installFontFromAws,
};
