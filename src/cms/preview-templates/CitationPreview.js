import React from 'react';
import CitationDetailPreview from '../../components/CitationDetailPreview';

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
  row.keywords = entry.getIn(['data', 'keywords']);
  row.keywords = row.keywords ? row.keywords.toJS() : [];

  return (
    <CitationDetailPreview row={row}/>
  );
};

export default CitationPreview;
