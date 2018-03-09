const fs = require("fs");
const yaml = require('js-yaml');

// adds a category to the citation with the given name if it matches the regex
// returns true if added
const addCategory = (citation, categoryName, regex) => {

    // check regex
    const s = citation.title + " " + citation.abstract;
    const matches = s.search(new RegExp(regex, "i")) >= 0;
    if(!matches)
        return false;

    // update if it already exists
    let exists = false;
    citation.categories.forEach(category => {
        if(category.name == categoryName) {
            exists = true;
        }
    })
    if(exists) {
        return false;
    } else { 
        // add a new one
        citation.categories.push({ 
            name: categoryName,
            enabled: true
        })
        return true;
    }
}

const directory = "src/data/citations/";
let numUpdated = 0;
const overwrite = false;

// check each citation file
fs.readdirSync(directory).forEach(filename => {
    const content = fs.readFileSync(directory + filename);
    const citation = yaml.safeLoad(content);
    const oldUpdated = numUpdated;

    if(overwrite)
        citation.categories = [];

    // add categories
    numUpdated += addCategory(citation, "Overview", 
        "(overview|introduction|summary|summarize)");
    
    numUpdated += addCategory(citation, "Symptoms", 
        "(\\sensor|symptom|\\bpain|\\bweak|\\bnumb|impairment|quality of life|\\bsever|\\bfibro|restless)");

    numUpdated += addCategory(citation, "Diagnosis", 
        "(differential|missense|morphalogical|\\bsensitivity|specificity|\\bmri\\b|\\bscan|biops|electro|action potential|amplitude|velocity|ultraso|conduction|latenc|imag)");

    numUpdated += addCategory(citation, "Genetics", 
        "(exon|exome|copy number|\\bloci|\\blocus|linkage|pcr\\b|polymorphism|point mutation|\\bSNP|\\bmice\\b|\\bmouse|MLPA|\\bFISH\\b|fluoresc|proband)");

    numUpdated += addCategory(citation, "Therapies", 
        "(treatment|treated|outcome|\\btherap|\\binterven|\\bimmobil|splint|inject|steroid|surgery|\\bdrug|pharma)");

    numUpdated += addCategory(citation, "Prevalence", 
        "(frequenc|prevalence|epidemiolog|survey|bank\\b|retrospect|population)");

    numUpdated += addCategory(citation, "Case Studies", 
        "(\\ba case\\b|\\ba patient\\b|\\bgirl\\b|woman|\\bman\\b|boy|\\binfant|\\bmother|\\bbaby)");

    numUpdated += addCategory(citation, "Biochemistry", 
        "(white matter|mitochondria|biomech|\\bmice\\b|\\bmouse|culture|microscop|\\bteas|lipid|mrna|vitro|receptor|integrin|laminin|actin|permeability|kinase|junction|polymer)");

    if(numUpdated > oldUpdated) {
        fs.writeFileSync(directory + filename, yaml.safeDump(citation));
        console.log("writing " + directory + filename);
    }
});

console.log("Updated " + numUpdated);