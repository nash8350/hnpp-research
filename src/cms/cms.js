import CMS from 'netlify-cms';
import 'netlify-cms/dist/cms.css';

import CitationPreview from './preview-templates/CitationPreview';

CMS.registerPreviewStyle('/styles.css');
CMS.registerPreviewTemplate('citation', CitationPreview);
