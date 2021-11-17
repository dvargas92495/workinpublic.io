const esbuild = require("esbuild").build;
const fs = require("fs");

const IGNORE_ENV = ["HOME"];
const getDotEnvObject = () => {
  const env = {
    ...Object.fromEntries(
      Object.entries(process.env)
        .filter(([k]) => !/[()]/.test(k))
        .filter(([k]) => !IGNORE_ENV.includes(k))
    ),
  };
  return Object.fromEntries(
    Object.keys(env).map((k) => [`process.env.${k}`, JSON.stringify(env[k])])
  );
};

const build = () => {
  if (!fs.existsSync("out")) fs.mkdirSync("out");
  const entryPoints = fs.readdirSync("embeds").map((f) => `embeds/${f}`);
  return esbuild({
    entryPoints,
    bundle: true,
    outdir: "out",
    minify: true,
    define: getDotEnvObject(),
  })
    .then(() => console.log("Finished!"))
    .catch((e) => {
      console.error("ERROR:", e.message);
      return 1;
    });
};

build();
