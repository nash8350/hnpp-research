import React from 'react';
import CitationDetail from '../../components/CitationDetail';

const CitationPreview = ({ entry, getAsset }) => {
  const row = {};
  row.title = entry.getIn(['data', 'title']);
  row.pmid = entry.getIn(['data', 'pmid']);
  row.abstract = entry.getIn(['data', 'abstract']);
  row.abstractLink = entry.getIn(['data', 'abstractLink']);
  row.categories = entry.getIn(['data', 'categories']);
  row.categories = row.categories ? row.categories.toJS() : [];
  row.date = entry.getIn(['data', 'date']);
  row.authors = entry.getIn(['data', 'authors']);
  row.authors = row.authors ? row.authors.toJS() : [];

  return (
    <CitationDetail row={row}/>
  );
};

export default CitationPreview;
