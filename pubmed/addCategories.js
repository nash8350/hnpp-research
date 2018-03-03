const fs = require("fs");
const yaml = require('js-yaml');

// adds a category to the citation with the given name if it matches the regex
// returns true if updated
const addCategory = (citation, categoryName, regex) => {
    // don't add if it already exists
    let exists = false;
    citation.categories.forEach(category => {
        if(category.name == categoryName)
            exists = true;
    })
    if(exists)
        return false;

    // check regex
    const s = citation.title + citation.abstract;
    if(s.search(new RegExp(regex, "i")) >= 0) {
        citation.categories.push({name: categoryName});
        return true;
    }

    return false;
}

const directory = "src/data/citations/";
let numUpdated = 0;

// check each citation file
fs.readdirSync(directory).forEach(filename => {
    const content = fs.readFileSync(directory + filename);
    const citation = yaml.safeLoad(content);

    // add categories
    numUpdated += addCategory(citation, "Symptoms", 
        "symptom|pain|weak|numb|impair|quality of life|sever|fibro|restless");

    numUpdated += addCategory(citation, "Diagnosis", 
        "morph|abnormal|mri|scan|biops|diagnos|electro|action potential|amplitude|velocity|ultrasound|conduction|test|latenc|imag");

    numUpdated += addCategory(citation, "Genetics", 
        "sequence|pmp|gene|peripheral myelin protein|mutat|wild|duplicat|17p11|dna");

    numUpdated += addCategory(citation, "Therapies", 
        "therap|interven|immobil|splint|inject|surgery|drug|compound");

    numUpdated += addCategory(citation, "Prevalance", 
        "frequenc|prevalence|epidemiolog|survey|bank|retrospect|population");

    numUpdated += addCategory(citation, "Case Studies", 
        "a case|a patient|girl|woman|man|boy|infant|mother|baby");

    if(citation.categories.length > 0) {
        fs.writeFileSync(directory + filename, yaml.safeDump(citation));
        console.log("writing " + directory + filename);
    }
});

console.log("Updated " + numUpdated);