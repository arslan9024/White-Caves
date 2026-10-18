import React, { memo, useState } from 'react';
import HenryDocumentStudio from './HenryDocumentStudio';
import HenryDossierPanel from './HenryDocumentStudio/HenryDossierPanel';
import HenryGenericDocumentPanel from './HenryDocumentStudio/HenryGenericDocumentPanel';
import HenryDrivePanel from './HenryDocumentStudio/HenryDrivePanel';
import type { DriveImport } from '../../services/henryDrive';
import HenryDriveIntake from './HenryDocumentStudio/HenryDriveIntake';

const HenryRecordsCRM = memo(() => {
  const [driveImport, setDriveImport] = useState<DriveImport | null>(null);
  return <><HenryDossierPanel /><HenryDrivePanel onImport={setDriveImport} />
    {driveImport ? <HenryDriveIntake key={driveImport.driveOrigin.proof} source={driveImport} />
      : <HenryGenericDocumentPanel />}<HenryDocumentStudio /></>;
});

export default HenryRecordsCRM;
