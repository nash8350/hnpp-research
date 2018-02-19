import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const columns = [{
    Header: 'Author',
    accessor: 'author'
  }, {
    Header: 'Quote',
    accessor: 'quote'
}];

export default ({ citations }) => (
  <div>
    {/* 
  <table class="table ishidden">
    <tr>
      <th>Author</th>
      <th>Quote</th>
    </tr>
    {citations.map(citation => (
      <tr>
        <td>{citation.author}</td>
        <td>{citation.quote}</td>
      </tr>
    ))}
  </table> */}

  <ReactTable
    data={citations}
    columns={columns}
    minRows={0}
  />
  </div>
);
