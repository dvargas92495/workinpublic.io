import AWS from "aws-sdk";

const cloudfront = new AWS.CloudFront();

const invalidate =
  process.env.NODE_ENV === "production"
    ? (Items: string[]) => {
        return cloudfront
          .createInvalidation({
            DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID || "",
            InvalidationBatch: {
              CallerReference: new Date().toJSON(),
              Paths: {
                Quantity: Items.length,
                Items,
              },
            },
          })
          .promise()
          .then(() => {});
      }
    : (Items: string[]) => console.log("Invalidated", Items.join(", "));

export default invalidate;
