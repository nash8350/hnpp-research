import React from 'react';
import graphql from 'graphql';

export const ResearchPageTemplate = ({
  title, description}) => (
  <section className="section section--gradient">
    <div className="container">
      <div className="column is-7">
        <h3 className="has-text-weight-semibold is-size-2">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  </section>
);

export default ({ data }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <ResearchPageTemplate
      title={frontmatter.title}
      description={frontmatter.description}
    />
  );
};

export const researchPageQuery = graphql`
  query ResearchPage($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      frontmatter {
        title
        description
      }
    }
  }
`;
