require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

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

    if (platform === "darwin") {
        // For MacOS
        const destination = path.join(
            process.env.HOME,
            "Library",
            "Fonts",
            path.basename(fontPath)
        );
        exec(`cp "${fontPath}" "${destination}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing font: ${error}`);
            } else {
                console.log("Font installed successfully on MacOS");
            }
            // Delete the local file regardless of installation success
            fs.unlink(fontPath, (unlinkError) => {
                if (unlinkError) {
                    console.error(
                        `Error deleting local font file: ${unlinkError}`
                    );
                } else {
                    console.log(`Deleted local font file: ${fontPath}`);
                }
            });
        });
    } else if (platform === "win32") {
        // For Windows
        const systemFontsPath = path.join(
            process.env.SYSTEMROOT,
            "Fonts",
            path.basename(fontPath)
        );
        exec(
            `copy "${fontPath}" "${systemFontsPath}"`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error installing font: ${error}`);
                } else {
                    console.log("Font installed successfully on Windows");
                }
                // Delete the local file regardless of installation success
                fs.unlink(fontPath, (unlinkError) => {
                    if (unlinkError) {
                        console.error(
                            `Error deleting local font file: ${unlinkError}`
                        );
                    } else {
                        console.log(`Deleted local font file: ${fontPath}`);
                    }
                });
            }
        );
    } else {
        console.error(
            "Platform not supported for automatic font installation."
        );
        // Delete the local file if platform is not supported
        fs.unlink(fontPath, (unlinkError) => {
            if (unlinkError) {
                console.error(`Error deleting local font file: ${unlinkError}`);
            } else {
                console.log(`Deleted local font file: ${fontPath}`);
            }
        });
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
        // If download fails, try to delete the potentially partially downloaded file
        fs.unlink(localFontPath, () => {});
    }
}

async function installFonts(fontUrls) {
    for (const url of fontUrls) {
        await installFontFromAws(url);
    }
}

installFontFromAws("https://tranches.s3.amazonaws.com/Manrope-Regular.ttf");

module.exports = {
    createRenderJobConfig,
    installFonts,
};
