const fs = require("fs-extra");
const sitesFolder = "sites";
var yaml = require("js-yaml");

// turn file structure into json object
const allSitesBySubvertical = fs.readdirSync(sitesFolder).map((subVertical) => {
  return {
    name: subVertical,
    sites: fs.readdirSync(`${sitesFolder}/${subVertical}`),
  };
});

const convertSiteConfigAndQuestionsToJson = (sitePath) => {
  fs.outputFileSync(
    `converted/${sitePath}/config.yaml`,
    JSON.stringify(
      yaml.load(fs.readFileSync(`${sitePath}/data/config.yaml`, "utf-8")),
      null,
      4
    )
  );

  fs.outputFileSync(
    `converted/${sitePath}/questions.yaml`,
    JSON.stringify(
      yaml.load(fs.readFileSync(`${sitePath}/data/questions.yaml`, "utf-8")),
      null,
      4
    )
  );
};

allSitesBySubvertical.forEach((subVertical) => {
  subVertical.sites.forEach((site) => {
    convertSiteConfigAndQuestionsToJson(`${sitesFolder}/${subVertical.name}/${site}`);
  });
});

// {
//     name: 'homeservices',
//     sites: [
//       'homealarmsurvey.com',
//       'homehvacsurvey.com',
//       'homeroofingsurvey',
//       'homewindowsurvey.com',
//       'qualifiedsolarsurvey',
//       'solarsurveyusa',
//       'thesolarsurvey',
//       'usaroofingsurvey.com',
//       'usasolarsurvey',
//       'usawindowsurvey.com',
//       'yourbesthomealarm.com'
//     ]
//   },
