import React from 'react';
import CitationFilter from '../components/CitationFilter';
import Content, { HTMLContent } from '../components/Content';
import {
  PagingState,
  IntegratedPaging,
  RowDetailState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  GroupingState,
  IntegratedGrouping,
  CustomGrouping
} from '@devexpress/dx-react-grid';
import {
  Grid, 
  Table, 
  TableHeaderRow, 
  TableColumnResizing,
  PagingPanel,
  TableRowDetail,
  TableGroupRow
} from '@devexpress/dx-react-grid-material-ui';

const TitleFormatter = ({ value }) =>
  <span className="textwrap">{value}</span>;

const TitleTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={TitleFormatter}
    {...props}
  />
);

const getChildGroups = groups => groups
  .map(group => ({ key: group.item, childRows: group.citations }));

export default class CitationTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      search: "",
      data: this.props.data
    };
    this.state.filteredData = this.generateTable();

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

  generateTable = () => {
    const itemMap = {};
    this.state.data.forEach(edge => {
        const citation = edge.node;

        //build a string list
        citation.authorlist = "";
        citation.authors.forEach(author => {
        citation.authorlist += author.name + ", ";
        })
        if(citation.authorlist.length > 1)
        citation.authorlist = citation.authorlist.substring(0, citation.authorlist.length - 2);

        if(this.filterRow(citation)) {
          citation[this.props.listName].forEach(row => {
              if(itemMap.hasOwnProperty(row[this.props.itemName])) {
                  itemMap[row[this.props.itemName]].push(citation);
              } else {
                  itemMap[row[this.props.itemName]] = [citation];
              }
          })
        }
    });

    const itemTable = [];
    for(let key in itemMap) {
        itemTable.push({
            item: key,
            numArticles: itemMap[key].length,
            citations: itemMap[key]
        })
    }
    itemTable.sort(function(a, b) {
        return b.numArticles - a.numArticles;
    });
    itemTable.forEach(row => {
        row.item = row.item + " (" + row.numArticles + ")";
    })

    return itemTable;
  }

  onFilterChange = (event) => {
    this.state[event.target.name] = event.target.value;
    const filteredData = this.generateTable();
    this.setState({
      [event.target.name]: event.target.value,
      filteredData: filteredData
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
            rows={this.state.filteredData}
            columns={this.props.cols}>
            <PagingState
              defaultCurrentPage={0}
              pageSize={20}
            />
            <RowDetailState
                defaultExpandedRowIds={[]}
              />
            <TitleTypeProvider
              for={['title']}
            />
            <SortingState
              defaultSorting={[{ columnName: 'date', direction: 'desc' }]}
            />
            <GroupingState
                grouping={[{ columnName: 'item' }]}
              />
              <CustomGrouping
                getChildGroups={getChildGroups}
              />
            <IntegratedSorting />
            <IntegratedPaging />
            <Table />
            <TableColumnResizing defaultColumnWidths={this.props.colWidths}/>
            <TableRowDetail
              contentComponent={({ row }) => (
                <div className="container is-pulled-left" style={{width: this.props.tableWidth, marginLeft: 100}}>
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
            <TableHeaderRow 
              showSortingControls
            />
            <TableGroupRow />
            <PagingPanel />
          </Grid>
        </div>
      </div>
    )
  };
}