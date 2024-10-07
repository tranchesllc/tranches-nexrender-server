require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const filePath = path.join(__dirname, "random-file.txt");
fs.writeFileSync(filePath, "This is a random file with some random content!");

const uploadFile = async () => {
    const fileStream = fs.createReadStream(filePath);

    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: "random-file.txt",
        Body: fileStream,
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("Upload Success", data);
    } catch (err) {
        console.log("Error", err);
    }
};

uploadFile();
