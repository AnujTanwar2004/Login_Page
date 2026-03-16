const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: process.env.AWS_REGION });

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

async function getUsers() {
  const bucket = process.env.S3_BUCKET_NAME;
  const key = process.env.USERS_OBJECT_KEY || "users.json";

  try {
    const response = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const body = await streamToString(response.Body);
    const parsed = JSON.parse(body || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return [];
    }
    throw error;
  }
}

async function saveUsers(users) {
  const bucket = process.env.S3_BUCKET_NAME;
  const key = process.env.USERS_OBJECT_KEY || "users.json";

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(users, null, 2),
      ContentType: "application/json",
    }),
  );
}

module.exports = { getUsers, saveUsers };
