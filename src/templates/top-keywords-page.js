import React from 'react';
import graphql from 'graphql';
import CitationsGroupedTable from '../components/CitationsGroupedTable';

export const TopKeywordsPageTemplate = ({
  title, description, keywordList}) => (
  <section className="section section--gradient">
    <div className="container">
      <h3 className="has-text-weight-semibold is-size-2">{title}</h3>
      <p>{description}</p>
      <br/>
      <CitationsGroupedTable 
        data={keywordList} 
        cols={[
            { name: 'item', title: 'Keyword' },
            { name: 'date', title: 'Date' },
            { name: 'title', title: 'Title' }
          ]}
        colWidths={[
            { columnName: 'item', width: 200 },
            { columnName: 'date', width: 125 },
            { columnName: 'title', width: 800-125 }
          ]}
        groupBy='item'
        tableWidth={800}
        />
    </div>
  </section>
);

export default ({ data }) => {
    // fill citations table
    const keywordMap = {};
    data.allCitationsYaml.edges.forEach(edge => {
        const citation = edge.node;

        //build a string list
        citation.authorlist = "";
        citation.authors.forEach(author => {
        citation.authorlist += author.name + ", ";
        })
        if(citation.authorlist.length > 1)
        citation.authorlist = citation.authorlist.substring(0, citation.authorlist.length - 2);

        //create a table of keywords
        citation.keywords.forEach(row => {
            if(keywordMap.hasOwnProperty(row.keyword)) {
                keywordMap[row.keyword].push(citation);
            } else {
                keywordMap[row.keyword] = [citation];
            }
        })
    });

    const keywordTable = [];
    for(let key in keywordMap) {
        keywordTable.push({
            item: key,
            numArticles: keywordMap[key].length,
            citations: keywordMap[key]
        })
    }
    keywordTable.sort(function(a, b) {
        return b.numArticles - a.numArticles;
    });
    keywordTable.forEach(row => {
        row.item = row.item + " (" + row.numArticles + ")";
    })

  return (
    <TopKeywordsPageTemplate
      title={data.page.frontmatter.title}
      description={data.page.frontmatter.description}
      keywordList={keywordTable}
    />
  );
};

export const topKeywordsQuery = graphql`
  query TopKeywordsPage($path: String!) {
    page: markdownRemark(frontmatter: {path: {eq: $path}}) {
      frontmatter {
        title
        description
      }
    }
    allCitationsYaml(
      sort: { fields: [date], order: DESC },
      filter: { id: { regex: "/citations/" } }
    ) {
      edges {
        node {
          pmid
          journal
          title
          abstract
          date
          authors {
            name
          }
          keywords {
            keyword
          }
          abstractLink
        }
      }
    }
  }  
`;
