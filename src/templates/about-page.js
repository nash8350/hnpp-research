import React from 'react';
import graphql from 'graphql';

export const AboutPageTemplate = ({
  title, description, data}) => (
  <section className="section section--gradient">
    <div className="container">
      <h3 className="has-text-weight-semibold is-size-4">{title}</h3>
      <p>{description}</p>
    </div>
  </section>
);

export default ({ data }) => {
  return (
    <AboutPageTemplate
      title={data.page.frontmatter.title}
      description={data.page.frontmatter.description}
    />
  );
};

export const aboutPageQuery = graphql`
  query AboutPage($path: String!) {
    page: markdownRemark(frontmatter: {path: {eq: $path}}) {
      frontmatter {
        title
        description
      }
    }
  }  
`;
