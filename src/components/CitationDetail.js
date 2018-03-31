import React from 'react';

function getWidth() {
    if(typeof document !== "object")
        return 1024;
    
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
}

export default ({ row }) => (
    <div className="is-pulled-left" style={getWidth() < 1024 ? {width: "340px"} : {width: "800px"}}>
        <a className="is-pulled-right vert-padded" style={{marginLeft: "20px"}} target="_blank" href={"/admin/#/collections/citations/entries/" + row.pmid}>Edit</a>
        { row.fullTextLink ? <a className="is-pulled-right vert-padded" target="_blank" style={{marginLeft: "20px"}} href={row.fullTextLink}>Free Full Text</a> : <span/> }
        <a className="is-pulled-right vert-padded" href={row.abstractLink} target="_blank">Pubmed</a>
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