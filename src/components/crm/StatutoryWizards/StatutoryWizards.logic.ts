/**
 * White Caves Real Estate LLC - Statutory Wizards Logic Hook
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Logic)
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useCallback } from 'react';
import { StatutoryWizardModalProps, StatutoryFlowType } from './StatutoryWizards.types';
import { STATUTORY_FLOWS } from './StatutoryWizards.data';

export function useStatutoryWizardLogic(
  props: Pick<StatutoryWizardModalProps, 'flowType' | 'onComplete' | 'onClose'>
) {
  const { flowType, onComplete, onClose } = props;
  const flowDef = useMemo(() => STATUTORY_FLOWS[flowType], [flowType]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Initialize form state with default values from the flow definition
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (flowDef && flowDef.steps) {
      flowDef.steps.forEach(step => {
        step.fields.forEach(field => {
          initial[field.key] = field.defaultValue || '';
        });
      });
    }
    return initial;
  });

  const handleFieldChange = useCallback((key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const totalSteps = flowDef ? flowDef.steps.length : 1;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Completed final step!
      if (onComplete && flowDef) {
        onComplete({
          flowType,
          resultToken: flowDef.deliverableResultToken,
          formData,
        });
      }
      onClose();
    }
  }, [currentStepIndex, totalSteps, onComplete, flowDef, flowType, formData, onClose]);

  const handlePreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const currentStep = flowDef?.steps[currentStepIndex];

  return {
    flowDef,
    currentStepIndex,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    formData,
    handleFieldChange,
    handleNextStep,
    handlePreviousStep,
  };
}
