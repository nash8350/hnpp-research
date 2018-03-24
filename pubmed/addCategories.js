const fs = require("fs");
const yaml = require('js-yaml');

// adds a category to the citation with the given name if it matches the regex
// returns true if added
const addCategoryFromRegex = (citation, categoryName, regex) => {

    // check regex
    const s = citation.title + " " + citation.abstract + " " + JSON.stringify(citation.keywords);
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

// adds a category based on a keyword match, returns true if added
const addCategoryFromKeyword = (citation, categoryName, keyword) => {
    let matches = false;
    citation.keywords.forEach(key => {
        if(key.keyword == keyword)
            matches = true;
    })
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
    numUpdated += addCategoryFromRegex(citation, "Symptoms", 
        "(\\sensor|symptom|\\bpain|\\bweak|\\bnumb|impairment|quality of life|\\bsever|\\bfibro|restless)");

    numUpdated += addCategoryFromRegex(citation, "Diagnosis", 
        "(differential|missense|morphalogical|\\bsensitivity|specificity|\\bmri\\b|\\bscan|biops|electro|action potential|amplitude|velocity|ultraso|conduction|latenc|imag)");
    numUpdated += addCategoryFromKeyword(citation, "Diagnosis", "diagnosis");
    numUpdated += addCategoryFromKeyword(citation, "Diagnosis", "Diagnosis, Differential ");

    numUpdated += addCategoryFromRegex(citation, "Genetics", 
        "(exon|exome|copy number|\\bloci|\\blocus|linkage|pcr\\b|polymorphism|point mutation|\\bSNP|\\bmice\\b|\\bmouse|MLPA|\\bFISH\\b|fluoresc|proband)");
    numUpdated += addCategoryFromKeyword(citation, "Genetics", "Polymerase Chain Reaction");

    numUpdated += addCategoryFromKeyword(citation, "Physiopathology", "physiopathology");
    numUpdated += addCategoryFromKeyword(citation, "Physiopathology", "physiology");
    numUpdated += addCategoryFromKeyword(citation, "Physiopathology", "Phenotype");
    numUpdated += addCategoryFromKeyword(citation, "Physiopathology", "ultrastructure");
    numUpdated += addCategoryFromKeyword(citation, "Physiopathology", "Microscopy, Electron");

    numUpdated += addCategoryFromRegex(citation, "Prevalence", 
        "(frequenc|prevalence|epidemiolog|survey|bank\\b|retrospect|population)");
    numUpdated += addCategoryFromKeyword(citation, "Prevalence", "epidemiology");

    numUpdated += addCategoryFromRegex(citation, "Case Studies", 
        "(\\ba case\\b|\\ba patient\\b|\\bgirl\\b|woman|\\bman\\b|boy|\\binfant|\\bmother|\\bbaby)");

    numUpdated += addCategoryFromRegex(citation, "Biochemistry", 
        "(mitochondria|biomech|\\bmice\\b|\\bmouse|culture|microscop|\\bteas|lipid|mrna|vitro|receptor|integrin|laminin|actin|permeability|kinase|junction|polymer)");
    numUpdated += addCategoryFromKeyword(citation, "Biochemistry", "metabolism");
    
    numUpdated += addCategoryFromRegex(citation, "Therapies", 
        "(treatment|treated|outcome|\\btherap|\\binterven|\\bimmobil|splint|inject|steroid|surgery|\\bdrug|pharma)");

    if(numUpdated > oldUpdated) {
        fs.writeFileSync(directory + filename, yaml.safeDump(citation));
        console.log("writing " + directory + filename);
    }
});

console.log("Updated " + numUpdated);