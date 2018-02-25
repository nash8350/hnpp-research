import React from 'react';
import graphql from 'graphql';
import CitationsGroupedTable from '../components/CitationsGroupedTable';

export const TopAuthorsPageTemplate = ({
  title, description, authorList}) => (
  <section className="section section--gradient">
    <div className="container">
      <h3 className="has-text-weight-semibold is-size-2">{title}</h3>
      <p>{description}</p>
      <br/>
      <CitationsGroupedTable 
        data={authorList} 
        cols={[
            { name: 'item', title: 'Author' },
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
    const authorMap = {};
    data.allCitationsYaml.edges.forEach(edge => {
        const citation = edge.node;

        //build a string list
        citation.authorlist = "";
        citation.authors.forEach(author => {
        citation.authorlist += author.name + ", ";
        })
        if(citation.authorlist.length > 1)
          citation.authorlist = citation.authorlist.substring(0, citation.authorlist.length - 2);

        //create a table of authors
        citation.authors.forEach(author => {
            if(authorMap.hasOwnProperty(author.name)) {
                authorMap[author.name].push(citation);
            } else {
                authorMap[author.name] = [citation];
            }
        })
    });

    const authorTable = [];
    for(let name in authorMap) {
        authorTable.push({
          item: name,
          numArticles: authorMap[name].length,
          citations: authorMap[name]
        })
    }
    authorTable.sort(function(a, b) {
        return b.numArticles - a.numArticles;
    });
    authorTable.forEach(row => {
        row.item = row.item + " (" + row.numArticles + ")";
    })

  return (
    <TopAuthorsPageTemplate
      title={data.page.frontmatter.title}
      description={data.page.frontmatter.description}
      authorList={authorTable}
    />
  );
};

export const topAuthorsQuery = graphql`
  query TopAuthorsPage($path: String!) {
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
