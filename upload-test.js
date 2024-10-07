require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Generate a random text file
const filePath = path.join(__dirname, 'random-file.txt');
fs.writeFileSync(filePath, 'This is a random file with some random content!');

// Function to upload the random file to S3
const uploadFile = async () => {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: 'your-bucket-name', // Replace with your bucket name
    Key: 'random-file.txt', // File name in S3
    Body: fileStream,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('Upload Success', data);
  } catch (err) {
    console.log('Error', err);
  }
};

// Call the upload function
uploadFile();
