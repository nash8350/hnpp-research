const fs = require("fs");
const yaml = require('js-yaml');
const xml2js = require('xml2js');

const content = fs.readFileSync("pubmed/pubmed.xml");
const directory = "src/data/citations/";
let data = {};
const options = { 
    charkey: "value",
    mergeAttrs: true,
    explicitArray: false
};

xml2js.parseString(content, options, function (err, result) {
    data = result;
});

const get = (p, o) =>
  p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : "", o);

const blacklist = [
    "27535300",
    "28360724"
];

const citationList = [];

data.PubmedArticleSet.PubmedArticle.forEach(article => {

    //console.log(yaml.safeDump(article.MedlineCitation));
    let citation = {};

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

    //load previous data if available
    try {
        const content = fs.readFileSync(directory + citation.pmid + ".yml");
        citation = yaml.safeLoad(content);
    } catch(err) {
    }
    
    //set title
    citation.title = get(['MedlineCitation','Article','ArticleTitle'], article);
    citation.title = citation.title.replace(/:/g,"").trim();

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

    // add blank categories if doesn't exist
    if(!citation.categories)
        citation.categories = [];

    //get the authors
    citation.authors = [];
    if(article.MedlineCitation.Article.AuthorList) {
        if(Array.isArray(article.MedlineCitation.Article.AuthorList.Author)) {
            article.MedlineCitation.Article.AuthorList.Author.forEach(author => {
                if(author.LastName)
                    citation.authors.push({ name: author.LastName + " " + author.Initials });
            })
        } else {
            if(article.MedlineCitation.Article.AuthorList.hasOwnProperty("Author"))
                citation.authors.push({ name: article.MedlineCitation.Article.AuthorList.Author.ForeName + " " + article.MedlineCitation.Article.AuthorList.Author.LastName });
        }
    }

    //get unique mesh terms and keywords
    uniqueKeywords = new Set();
    citation.keywords = [];
    function addUniqueKeyword(key) {
        if(!uniqueKeywords.has(key)) {
            citation.keywords.push({ keyword: key });
            uniqueKeywords.add(key);
        }
    }
    if(article.MedlineCitation.MeshHeadingList) {
        article.MedlineCitation.MeshHeadingList.MeshHeading.forEach(heading => {
            addUniqueKeyword(heading.DescriptorName.value);
            if(heading.QualifierName) {
                if(Array.isArray(heading.QualifierName)) {
                    heading.QualifierName.forEach(qualifier => {
                        addUniqueKeyword(qualifier.value);
                    })
                } else {
                    addUniqueKeyword(heading.QualifierName.value);
                }
            }
        })
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

    // cites
    citation.cites = [];
    if(article.MedlineCitation && article.MedlineCitation.CommentsCorrectionsList) {
        if(Array.isArray(article.MedlineCitation.CommentsCorrectionsList.CommentsCorrections)) {
            article.MedlineCitation.CommentsCorrectionsList.CommentsCorrections.forEach( comment => {
                if(comment.RefType == "Cites") {
                    citation.cites.push({ pmid: comment.PMID.value });
                }
            })
        }
    }

    // add a link
    citation.abstractLink = "https://www.ncbi.nlm.nih.gov/pubmed/?term=" + citation.pmid + "%5Buid%5D&cmd=DetailsSearch";

    if(!blacklist.includes(citation.pmid))
        citationList.push(citation);
})

// cited by
citationList.forEach(c1 => {
    c1.citedBy = [];
    citationList.forEach(c2 => {
        c2.cites.forEach(c3 => {
            if(c3.pmid == c1.pmid) {
                c1.citedBy.push ({
                    pmid: c2.pmid,
                    title: c2.title
                })
            }
        })
    })
})

// write files
citationList.forEach(citation => {
    const file = directory + citation.pmid + ".yml";
    fs.writeFileSync(file, yaml.safeDump(citation));
    console.log("writing " + file);
})