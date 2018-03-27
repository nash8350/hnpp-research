import React from 'react';
import graphql from 'graphql';
import ResearchExplorer from '../components/ResearchExplorer';

export const ResearchPageTemplate = ({
  title, description, data}) => (
  <div className="container">
    <h3 className="has-text-weight-semibold is-size-4">{title}</h3>
    <p>{description}</p>
    <br/>
    <br/>
    <ResearchExplorer data={data} />
  </div>
);

export default ({ data }) => {
  return (
    <ResearchPageTemplate
      title={data.page.frontmatter.title}
      description={data.page.frontmatter.description}
      data={data.allCitationsYaml.edges}
    />
  );
};

export const researchPageQuery = graphql`
  query ResearchPage($path: String!) {
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
          fullTextLink
          citedBy {
            pmid
          }
          categories {
            name
            enabled
          }
        }
      }
    }
  }  
`;