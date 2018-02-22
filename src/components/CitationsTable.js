import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Content, { HTMLContent } from '../components/Content';

const columns = [{
    Header: 'Date',
    accessor: 'date',
    width: 100
  }, {
    Header: 'Title',
    accessor: 'title',
    Cell: row => (<a href={"https://www.ncbi.nlm.nih.gov/pubmed/?term=" + row.original.pmid + "%5Buid%5D&cmd=DetailsSearch"}>{row.value}</a>)
}];

export default ({ citations }) => (
  <div className="columns">
    <div className="column is-2">
      <h1 className="is-size-6 has-text-weight-bold is-bold-light vert-padded">Filter by tag</h1>
      <div className="field">
        <div className="control">
          <label className="checkbox">
            <input type="checkbox"/>
            <span className="horiz-padded">Epidemiology</span>
          </label>
          <label className="checkbox">
            <input type="checkbox"/>
            <span className="horiz-padded">Symptoms</span>
          </label>
        </div>
      </div>
    </div>
    <div className="column">
      <ReactTable
        data={citations}
        columns={columns}
        minRows={0}
        filterable={true}
        defaultSortDesc={true}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id
          return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(String(filter.value).toLowerCase()) >= 0 : true
        }}
        SubComponent={(row) => {
          return (
            <div className="container">
              <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Abstract</h4>
              <p>{row.original.abstract}</p>
              <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Authors</h4>
              <p>{row.original.authorlist}</p>
              <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Journal</h4>
              <p>{row.original.journal}</p>
              <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Keywords</h4>
              <ul>
                {row.original.keywords.map(keyword => (
                  <li className="bullet">{keyword.keyword}</li>
                ))}
              </ul>
              <br/>
            </div>
          )
        }}
      />
    </div>
  </div>
);
