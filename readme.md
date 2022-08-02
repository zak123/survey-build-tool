This app pulls all the YAML files for survey configs, converts them to JSON files, and then uploads them to the JTK sites table. Use this tool to mass correct when any changes are made.

1. Copy data/sites folder into the root of this project from the SC.GF2.UI repository
2. npm i
3. Set "uploadToDatabase" boolean to true/false in app.js
4. node app.js

