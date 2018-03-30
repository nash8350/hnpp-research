import React from 'react';
import CitationDetail from '../components/CitationDetail';
import {
  PagingState,
  IntegratedPaging,
  RowDetailState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider
} from '@devexpress/dx-react-grid';
import {
  Grid, 
  Table, 
  TableHeaderRow, 
  TableColumnResizing,
  PagingPanel,
  TableRowDetail
} from '@devexpress/dx-react-grid-material-ui';

const TitleFormatter = ({ value }) =>
<span className="textwrap">{value}</span>;

const TitleTypeProvider = props => (
<DataTypeProvider
  formatterComponent={TitleFormatter}
  {...props}
/>
);

export default class CitationTable extends React.Component {
  constructor(props) {
    super(props);
  }

  filterRow = (row) => {
    if(this.props.date && row.date <= this.props.date)
      return false;

    if(this.props.availability == "free")
      if(!row.fullTextLink)
        return false;

    let categoryMatch = false;
    if(this.props.category == "") {
      categoryMatch = true;
    } else {
      row.categories.forEach(category => {
        if(this.props.category == category.name && category.enabled)
          categoryMatch = true;
      })
    }
    if(!categoryMatch)
      return false;

    if(this.props.search && 
      row.title.search(new RegExp(this.props.search, "i")) == -1 && 
      row.authorlist.search(new RegExp(this.props.search, "i")) == -1 &&
      row.abstract.search(new RegExp(this.props.search, "i")) == -1)
      return false;

    return true;
  }

  render() {
    // fill citations table
    const citations = [];
    this.props.data.forEach(edge => {
      const citation = edge.node;

      //list authors
      citation.authorlist = "";
      citation.authors.forEach(author => {
        citation.authorlist += author.name + ", ";
      })
      if(citation.authorlist.length > 1)
        citation.authorlist = citation.authorlist.substring(0, citation.authorlist.length - 2);

      // num cited by
      citation.numCitedBy = citation.citedBy.length;

      citations.push(citation);
    });

    const filteredCitations = citations.filter(this.filterRow);

    return (
      <Grid
      rows={filteredCitations}
      columns={[
        { name: 'date', title: 'Date' },
        { name: 'title', title: 'Title' },
        { name: 'numCitedBy', title: 'Cited By' }
      ]}>
        <PagingState
          defaultCurrentPage={0}
          pageSize={20}
        />
        <RowDetailState
          defaultExpandedRowIds={[]}
        />
        <SortingState
          defaultSorting={[{ columnName: 'date', direction: 'desc' }]}
        />
        <TitleTypeProvider
          for={['title']}
        />
        <IntegratedSorting />
        <IntegratedPaging />
        <Table />
        <TableColumnResizing defaultColumnWidths={this.props.colWidths}/>
        <TableHeaderRow 
          showSortingControls
        />
        <TableRowDetail contentComponent={CitationDetail} />
        <PagingPanel />
      </Grid>
    )
  };
}
