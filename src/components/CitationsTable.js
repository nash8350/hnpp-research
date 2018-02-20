import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const columns = [{
    Header: 'Date',
    accessor: 'pubdate',
    width: 125
  }, {
    Header: 'Authors',
    accessor: 'authorlist',
    width: 300
  }, {
    Header: 'Title',
    accessor: 'title',
    Cell: row => (<a href={"https://www.ncbi.nlm.nih.gov/pubmed/?term=" + row.original.uid + "%5Buid%5D&cmd=DetailsSearch"}>{row.value}</a>)
  }, {
    Header: 'Source',
    accessor: 'source',
    width: 225
}];

export default ({ citations }) => (
  <div>
{/*}
  <table class="table ishidden">
    <tr>
      <th>Author</th>
      <th>Title</th>
      <th>Quote</th>
    </tr>
    {citations.map(citation => (
      <tr>
        <td>{citation.pubdate}</td>
        <td>{citation.title}</td>
        <td>{citation.source}</td>
      </tr>
    ))}
  </table> */} 

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
  />
  </div>
);
