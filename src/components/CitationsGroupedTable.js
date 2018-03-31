import React from 'react';
import CitationFilter from '../components/CitationFilter';
import CitationDetail from '../components/CitationDetail';
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
  <span className="article-title">{value}</span>;

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
      columnWidths: [
        { columnName: 'item', width: 100 },
        { columnName: 'date', width: 100 },
        { columnName: 'title', width: 600 }
      ]
    };
  }

  componentDidMount() {
    if(typeof document != "object") 
      return;

    const width = Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );

    if(width < 1024)
      this.setState({
        columnWidths: [
          { columnName: 'item', width: 75 },
          { columnName: 'date', width: 75 },
          { columnName: 'title', width: width-185 }
        ]
      })
    else
      this.setState({
        columnWidths: [
          { columnName: 'item', width: 100 },
          { columnName: 'date', width: 100 },
          { columnName: 'title', width: width-550 }
        ]
      })
  }

  changeColumnWidths = (columnWidths) => {
    this.setState({ columnWidths });
  };

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
      row.abstract.search(new RegExp(this.props.search, "i")) == -1 &&
      JSON.stringify(row.keywords).search(new RegExp(this.props.search, "i")) == -1)
      return false;

    return true;
  }

  render() {
    const itemMap = {};
    this.props.data.forEach(edge => {
        const citation = edge.node;

        //build a string list of authors
        citation.authorlist = "";
        citation.authors.forEach(author => {
          citation.authorlist += author.name + ", ";
        })
        if(citation.authorlist.length > 1)
          citation.authorlist = citation.authorlist.substring(0, citation.authorlist.length - 2);

        // build a map of the items grouped together
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

    // now build a table sorted by count
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

    return (
      <Grid
        rows={itemTable}
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
        <Table/>
        <TableColumnResizing
          columnWidths={this.state.columnWidths}
          onColumnWidthsChange={this.changeColumnWidths}
        />
        <TableRowDetail contentComponent={CitationDetail} />
        <TableHeaderRow 
          showSortingControls
        />
        <TableGroupRow />
        <PagingPanel />
      </Grid>
    )
  };
}