import React from 'react';
import CitationFilter from '../components/CitationFilter';
import CitationDetail from '../components/CitationDetail';
import Content, { HTMLContent } from '../components/Content';
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
    this.state = {
      date: "",
      search: "",
      category: "",
      citations: this.props.citations,
      filteredCitations: this.props.citations
    };

    this.tableWidth = 800;
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  filterRow = (row) => {
    if(this.state.date && row.date <= this.state.date)
      return false;

    let categoryMatch = false;
    if(this.state.category == "") {
      categoryMatch = true;
    } else {
      row.categories.forEach(category => {
        if(this.state.category == category.name && category.enabled)
          categoryMatch = true;
      })
    }
    if(!categoryMatch)
      return false;

    if(this.state.search && 
      row.title.search(new RegExp(this.state.search, "i")) == -1 && 
      row.authorlist.search(new RegExp(this.state.search, "i")) == -1 &&
      row.abstract.search(new RegExp(this.state.search, "i")) == -1)
      return false;

    return true;
  }

  onFilterChange = (event) => {
    this.state[event.target.name] = event.target.value;
    const filteredCitations = this.state.citations.filter(this.filterRow);
    this.setState({
      [event.target.name]: event.target.value,
      filteredCitations: filteredCitations
    });
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-2">
          <CitationFilter 
            date={this.state.date} 
            search={this.state.search} 
            category={this.state.category}
            onFilterChange={this.onFilterChange}
            />
        </div>
        <div className="column is-10">
          <Grid
            rows={this.state.filteredCitations}
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
            <TableColumnResizing defaultColumnWidths={[
              { columnName: 'date', width: 100 },
              { columnName: 'title', width: this.tableWidth-200 },
              { columnName: 'numCitedBy', width: 100 }
            ]}/>
            <TableHeaderRow 
              showSortingControls
            />
            <TableRowDetail contentComponent={CitationDetail} />
            <PagingPanel />
          </Grid>
        </div>
      </div>
    )
  };
}
