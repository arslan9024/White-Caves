import { ComponentType } from 'react';

export interface DynamicAssistantProps {
  activeAssistant?: any;
  assistant?: any;
  content?: any;
  [key: string]: any;
}

declare const DynamicAssistantCRM: ComponentType<DynamicAssistantProps>;

export default DynamicAssistantCRM;
export { DynamicAssistantCRM };
