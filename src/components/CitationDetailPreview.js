import React from 'react';
import Content, { HTMLContent } from '../components/Content';

export default ({ row }) => (
    <div className="container is-pulled-left">
        <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Title</h4>
        <p>{row.title}</p>
        <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Abstract</h4>
        <p>{row.abstract}</p>
        <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Authors</h4>
        <p>{row.authorlist}</p>
        <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Pubmed ID</h4>
        <p>{row.pmid}</p>
        <div className="columns">
        <div className="column is-half">
            <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Categories</h4>
            <ul>
            {row.categories.map(category => (
                category.enabled && <li className="bullet" key={category.name}>{category.name}</li>
            ))}
            </ul>
            </div>
            <div className="column is-half">
            <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Keywords</h4>
            <ul>
            {row.keywords.map(keyword => (
                <li className="bullet" key={keyword.keyword}>{keyword.keyword}</li>
            ))}
            </ul>
        </div>
        </div>
        <br/>
    </div>
);