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
  // fill citations table
  const citations = [];
  data.allCitationsYaml.edges.forEach(edge => {
    const citation = edge.node;

    //list authors
    citation.authorlist = "";
    citation.authors.forEach(author => {
      citation.authorlist += author.name + ", ";
    })
    if(citation.authorlist.length > 1)
      citation.authorlist = citation.authorlist.substring(0, citation.authorlist.length - 2);

    citations.push(citation);
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
    allCitationsYaml(sort: { fields: [pubdate], order: DESC }) {
      edges {
        node {
          pubdate
          title
          uid
          authors {
            name
          }
          source
        }
      }
    }
  }  
`;
