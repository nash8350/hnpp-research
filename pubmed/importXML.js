const fs = require("fs");
const yaml = require('js-yaml');
const xml2js = require('xml2js');

const get = (p, o) =>
  p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : "", o);

const content = fs.readFileSync("pubmed/pubmed.xml");
let data = {};
const options = { 
    charkey: "value",
    mergeAttrs: true,
    explicitArray: false
};
xml2js.parseString(content, options, function (err, result) {
    data = result;
});

data.PubmedArticleSet.PubmedArticle.forEach(article => {

    //console.log(yaml.safeDump(article.MedlineCitation));
    
    //create our own simpler schema
    const citation = {};

    citation.title = get(['MedlineCitation','Article','ArticleTitle'], article);
    citation.title = citation.title.replace(/:/g,"").trim();
    citation.journal = get(['MedlineCitation','Article','Journal','Title'], article);
    citation.journal = citation.journal.replace(/:/g,"").trim();

    //get the authors
    citation.authors = [];
    if(article.MedlineCitation.Article.AuthorList) {
        if(Array.isArray(article.MedlineCitation.Article.AuthorList.Author)) {
            article.MedlineCitation.Article.AuthorList.Author.forEach(author => {
                citation.authors.push({ name: author.LastName + " " + author.Initials });
            })
        } else {
            if(article.MedlineCitation.Article.AuthorList.hasOwnProperty("Author"))
                citation.authors.push({ name: article.MedlineCitation.Article.AuthorList.Author.ForeName + " " + article.MedlineCitation.Article.AuthorList.Author.LastName });
        }
    }

    //get the mesh terms
    citation.keywords = [];
    if(article.MedlineCitation.MeshHeadingList) {
        article.MedlineCitation.MeshHeadingList.MeshHeading.forEach(heading => {
            citation.keywords.push({ keyword: heading.DescriptorName.value });
            if(heading.QualifierName) {
                if(Array.isArray(heading.QualifierName)) {
                    heading.QualifierName.forEach(qualifier => {
                        citation.keywords.push({ keyword: qualifier.value });
                    })
                } else {
                    citation.keywords.push({ keyword: heading.QualifierName.value });
                }
            }
        })
    }

    //normalize the abstract
    citation.abstract = "";
    if(article.MedlineCitation.Article.Abstract) {
        if(Array.isArray(article.MedlineCitation.Article.Abstract.AbstractText)) {
            article.MedlineCitation.Article.Abstract.AbstractText.forEach(element => {
                citation.abstract += element.value + " ";
            });
        } else if(article.MedlineCitation.Article.Abstract.AbstractText.hasOwnProperty('value')) {
            citation.abstract = article.MedlineCitation.Article.Abstract.AbstractText.value;
        } else {
            citation.abstract = article.MedlineCitation.Article.Abstract.AbstractText;
        }
        citation.abstract = citation.abstract.replace(/:/g,"").trim();
    }

    // add a date we can sort on
    citation.date = "";
    article.PubmedData.History.PubMedPubDate.forEach(date => {
        if(date.PubStatus == "pubmed") {
            citation.date = date.Year + "/";
            if(date.Month.length == 1) 
                citation.date += "0";
            citation.date += date.Month;
        } 
    })

    // set filename to the PMID
    citation.pmid = "missing";
    const ids = article.PubmedData.ArticleIdList.ArticleId;
    if(Array.isArray(ids)) {
        ids.forEach(id => {
            if(id.IdType == "pubmed") {
                citation.pmid = id.value;
            }
        });
    } else {
        citation.pmid = article.PubmedData.ArticleIdList.ArticleId.value;
    }
    const file = "src/data/citations/" + citation.pmid + ".yml";

    fs.writeFileSync(file, yaml.safeDump(citation));
    console.log("writing " + file);
})