declare module 'react-datepicker' {
  import { ComponentType } from 'react';
  
  interface DatePickerProps {
    selected?: Date | null;
    onChange: (date: Date | null) => void;
    showTimeSelect?: boolean;
    timeFormat?: string;
    timeIntervals?: number;
    dateFormat?: string;
    minDate?: Date;
    maxDate?: Date;
    placeholderText?: string;
    className?: string;
    disabled?: boolean;
    inline?: boolean;
    isClearable?: boolean;
    [key: string]: unknown;
  }

  const DatePicker: ComponentType<DatePickerProps>;
  export default DatePicker;
}

declare module 'react-datepicker/dist/react-datepicker.css' {
  const content: string;
  export default content;
}
