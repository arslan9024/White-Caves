import React, { memo } from 'react';
import HenryDocumentStudio from './HenryDocumentStudio';
import HenryDossierPanel from './HenryDocumentStudio/HenryDossierPanel';

const HenryRecordsCRM = memo(() => {
  return <><HenryDossierPanel /><HenryDocumentStudio /></>;
});

export default HenryRecordsCRM;
