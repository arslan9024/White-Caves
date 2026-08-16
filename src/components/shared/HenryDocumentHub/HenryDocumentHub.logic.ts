import { useState, useCallback } from 'react';

export interface WizardStep {
  id: number;
  title: string;
  description: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: 'Upload Document', description: 'Upload title deed, Emirates ID, or passport PDF for AI OCR extraction' },
  { id: 2, title: 'OCR Metadata Processing', description: 'Automated data extraction of buyer/seller names, BRN, and DLD numbers' },
  { id: 3, title: 'Form Selection', description: 'Select RERA Form A (Seller), Form B (Buyer), or Form I (Agent Split)' },
  { id: 4, title: 'Compliance & AML Verification', description: 'Real-time Trakheesi permit validation and AML risk clearance' },
  { id: 5, title: 'PDF Compilation & Signature', description: 'Generate final encrypted PDF document ready for digital e-signature' },
];

export function useHenryDocumentHubLogic() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedForm, setSelectedForm] = useState<'Form A' | 'Form B' | 'Form I'>('Form A');
  const [extractedName, setExtractedName] = useState('Arsalan Malik');
  const [isComplete, setIsComplete] = useState(false);

  const nextStep = useCallback(() => {
    if (currentStep < 5) {
      setIsProcessing(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsProcessing(false);
        if (currentStep === 4) setIsComplete(true);
      }, 500);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setIsComplete(false);
    }
  }, [currentStep]);

  return {
    currentStep,
    isProcessing,
    selectedForm,
    setSelectedForm,
    extractedName,
    setExtractedName,
    isComplete,
    nextStep,
    prevStep,
    steps: WIZARD_STEPS,
  };
}
