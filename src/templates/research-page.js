import React from 'react';
import graphql from 'graphql';
import CitationsTable from '../components/CitationsTable';

export const ResearchPageTemplate = ({
  title, description, citations}) => (
  <section className="section section--gradient">
    <div className="container">
      <h3 className="has-text-weight-semibold is-size-2">{title}</h3>
      <p>{description}</p>
      <br/>
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

    //list keywords
    citation.keywordlist = "";
    citation.keywords.forEach(keyword => {
      citation.keywordlist += keyword.keyword + ", ";
    })
    if(citation.keywordlist.length > 1)
      citation.keywordlist = citation.keywordlist.substring(0, citation.keywordlist.length - 2);

    // num cited by
    citation.numCitedBy = citation.citedBy.length;

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
          citedBy {
            pmid
          }
        }
      }
    }
  }  
`;
