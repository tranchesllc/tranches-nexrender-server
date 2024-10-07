const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ 
  region: process.env.AWS_REGION, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const run = async () => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("Success", data.Buckets);
  } catch (err) {
    console.log("Error", err);
  }
};
run();
