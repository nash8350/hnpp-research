import React from 'react';
import CitationFilter from '../components/CitationFilter';
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
      citations: this.props.citations,
      filteredCitations: this.props.citations
    };

    this.tableWidth = 800;
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  filterRow = (row) => {
    if(this.state.date && row.date <= this.state.date)
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
          <CitationFilter date={this.state.date} search={this.state.search} onFilterChange={this.onFilterChange}/>
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
            <TableRowDetail
              contentComponent={({ row }) => (
                <div className="container is-pulled-left" style={{width: this.tableWidth}}>
                  <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Abstract</h4>
                  <p>{row.abstract}</p>
                  <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Authors</h4>
                  <p>{row.authorlist}</p>
                  <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Journal</h4>
                  <p>{row.journal}</p>
                  <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Keywords</h4>
                  <ul>
                    {row.keywords.map(keyword => (
                      <li className="bullet">{keyword.keyword}</li>
                    ))}
                  </ul>
                  <h4 className="is-size-10 has-text-weight-bold is-bold-light vert-padded">Links</h4>
                  <a href={row.abstractLink}>View on Pubmed</a>
                  <br/>
                </div>
              )}
            />
            <PagingPanel />
          </Grid>
        </div>
      </div>
    )
  };
}
