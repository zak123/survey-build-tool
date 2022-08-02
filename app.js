const fs = require("fs-extra");
const sitesFolder = "sites";
var yaml = require("js-yaml");

// turn file structure into json object
const allSitesBySubvertical = fs
  .readdirSync(sitesFolder, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((subVertical) => {
    return {
      name: subVertical.name,
      sites: fs.readdirSync(`${sitesFolder}/${subVertical.name}`),
    };
  });

// take a given site directory, inspect /data/, convert yaml files to json, and place them in /converted/
const convertSiteConfigAndQuestionsToJson = (sitePath) => {
  const filesToConvert = [];

  fs.readdirSync(`${sitePath}/data`).forEach((item) => {
    if (
      item == "questions.yaml" ||
      item == "config.yaml" ||
      item.startsWith("alternate-config") ||
      item.startsWith("alternate-questions")
    ) {
      filesToConvert.push(`${sitePath}/data/${item}`);
    }
  });

  filesToConvert.forEach((item) => {
    fileName = item.replace(/^.*[\\\/]/, "");

    fs.outputFileSync(
      `converted/${sitePath}/${fileName}`,
      JSON.stringify(
        {
          ...yaml.load(fs.readFileSync(item, "utf-8")),
          uploadDetails: { type: fileName },
        },
        null,
        4
      )
    );
  });
};

// run conversion for each subvertical/site
allSitesBySubvertical.forEach((subVertical) => {
  subVertical.sites.forEach((site) => {
    convertSiteConfigAndQuestionsToJson(
      `${sitesFolder}/${subVertical.name}/${site}`
    );
  });
});
