import deploy from "fuegojs/dist/deploy";

const fuegoDeploy = () =>
  process.env.NODE_ENV === "production"
    ? deploy({
        domain: (process.env.HOST || "").replace(/^https?:\/\//, ""),
      }).then(() => console.log("deployed successfully"))
    : console.log("Wrote locally");

export default fuegoDeploy;
