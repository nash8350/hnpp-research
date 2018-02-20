const fs = require("fs");
const yaml = require('js-yaml');

const content = fs.readFileSync("pubmed/pubmed.json");
const jsonContent = JSON.parse(content);
for(let pmid in jsonContent.result) {
    if(pmid === 'uids')
        continue;
    const citation = yaml.safeDump(jsonContent.result[pmid]);
    const file = "src/data/citations/" + pmid + ".yml";
    fs.writeFileSync(file, citation);
    console.log("writing " + file)
}