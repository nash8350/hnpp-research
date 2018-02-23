import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Content, { HTMLContent } from '../components/Content';

const columns = [{
    Header: 'Author',
    accessor: 'author',
    width: 200
  }, {
    Header: 'Number of articles',
    accessor: 'numArticles'
}];

export default ({ authorList }) => (
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
        data={authorList}
        columns={columns}
        minRows={0}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id
          return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(String(filter.value).toLowerCase()) >= 0 : true
        }}
        SubComponent={(row) => {
          return (
            <div className="container">
              <ul className="bullet">
                {row.original.citations.map(citation => (
                  <li><a href={citation.abstractLink}>{citation.date} - {citation.title}</a></li>
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
