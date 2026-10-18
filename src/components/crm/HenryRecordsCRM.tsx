import React, { memo } from 'react';
import HenryDocumentStudio from './HenryDocumentStudio';
import HenryDossierPanel from './HenryDocumentStudio/HenryDossierPanel';
import HenryGenericDocumentPanel from './HenryDocumentStudio/HenryGenericDocumentPanel';

const HenryRecordsCRM = memo(() => {
  return <><HenryDossierPanel /><HenryGenericDocumentPanel /><HenryDocumentStudio /></>;
});

export default HenryRecordsCRM;
