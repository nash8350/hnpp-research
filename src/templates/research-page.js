import React from 'react';
import graphql from 'graphql';
import CitationsTable from '../components/CitationsTable';

export const ResearchPageTemplate = ({
  title, description, citations}) => (
  <section className="section section--gradient">
    <div className="container">
      <div className="column is-7">
        <h3 className="has-text-weight-semibold is-size-2">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
    <div className="section">
      <CitationsTable citations={citations} />
    </div>
  </section>
);

export default ({ data }) => {
  let citations = [];
  data.allCitationsYaml.edges.forEach(edge => {
    citations.push(edge.node);
  });

  return (
    <ResearchPageTemplate
      title={data.page.frontmatter.title}
      description={data.page.frontmatter.description}
      citations={citations}
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
    allCitationsYaml {
      edges {
        node {
          author
          quote
          title
        }
      }
    }
  }  
`;
