const fs = require("fs");
const yaml = require('js-yaml');

console.log("\n *START* \n");
var content = fs.readFileSync("pubmed/pubmed.json");
var jsonContent = JSON.parse(content);
for(let pmid in jsonContent.result) {
    if(pmid === 'uids')
        continue;
    var citation = yaml.safeDump(jsonContent.result[pmid]);
    fs.writeFileSync("data/citations/" + pmid + ".yml", citation);
}
console.log("\n *EXIT* \n");