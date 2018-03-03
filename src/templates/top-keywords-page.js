import React from 'react';
import graphql from 'graphql';
import CitationsGroupedTable from '../components/CitationsGroupedTable';

export const TopKeywordsPageTemplate = ({
  title, description, data}) => (
  <section className="section section--gradient">
    <div className="container">
      <h3 className="has-text-weight-semibold is-size-2">{title}</h3>
      <p>{description}</p>
      <br/>
      <CitationsGroupedTable 
        data={data} 
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
        listName='keywords'
        itemName='keyword'
        tableWidth={800}
        />
    </div>
  </section>
);

export default ({ data }) => {
  return (
    <TopKeywordsPageTemplate
      title={data.page.frontmatter.title}
      description={data.page.frontmatter.description}
      data={data.allCitationsYaml.edges}
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
