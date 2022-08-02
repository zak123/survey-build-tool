const fs = require("fs-extra");
const sitesFolder = "sites";
const yaml = require("js-yaml");
const axios = require("axios");

const uploadToDatabase = false;

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

    json = {
      ...yaml.load(fs.readFileSync(item, "utf-8")),
      uploadDetails: {
        type: fileName,
        site: sitePath.replace(/^.*[\\\/]/, ""),
      },
    };
    jsonString = JSON.stringify(json, null, 4);

    fs.outputFileSync(`converted/${sitePath}/${fileName}`, jsonString);

    if (uploadToDatabase) {
      axios({
        method: "post",
        url: "http://localhost:3000/api/survey-utility",
        data: {
          ...json,
        },
      })
        .then(() => {
          console.log(`${sitePath} uploaded`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
