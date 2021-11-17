const esbuild = require("esbuild").build;
const fs = require("fs");

const build = () => {
  if (!fs.existsSync("dist")) fs.mkdirSync("dist");
  const entryPoints = fs.readdirSync("embeds").map((f) => `embeds/${f}`);
  return esbuild({
    entryPoints,
    bundle: true,
    outdir: "out",
    minify: true,
  })
    .then(() => console.log("Finished!"))
    .catch((e) => {
      console.error("ERROR:", e.message);
      return 1;
    });
};

build();
