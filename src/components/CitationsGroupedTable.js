import React from 'react';
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

export default ({ data, cols, groupBy, colWidths, tableWidth}) => (
  <div className="container">
    <Grid
      rows={data}
      columns={cols}>
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
          grouping={[{ columnName: groupBy }]}
        />
        <CustomGrouping
          getChildGroups={getChildGroups}
        />
      <IntegratedSorting />
      <IntegratedPaging />
      <Table />
      <TableColumnResizing defaultColumnWidths={colWidths}/>
      <TableRowDetail
        contentComponent={({ row }) => (
          <div className="container is-pulled-left" style={{width: tableWidth, marginLeft: 100}}>
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
);
