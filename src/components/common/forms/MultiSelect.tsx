import React, { useState, useRef, useEffect, forwardRef } from 'react';
import * as S from './MultiSelect.styles';

interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label?: string;
  placeholder?: string;
  value: (string | number)[];
  onChange: (selectedValues: (string | number)[]) => void;
  options: MultiSelectOption[];
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  searchable?: boolean;
  className?: string;
}

const MultiSelect = forwardRef<HTMLSelectElement, MultiSelectProps>(
  ({
    label,
    placeholder = 'Select options...',
    value = [],
    onChange,
    options = [],
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    searchable = true,
    className = '',
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const isError = !!error;

    const filteredOptions = searchable
      ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
      : options;

    const selectedLabels = options
      .filter(opt => value.includes(opt.value))
      .map(opt => opt.label);

    const handleToggleOption = (optionValue: string | number) => {
      if (value.includes(optionValue)) {
        onChange(value.filter(v => v !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    };

    const removeOption = (optionValue: string | number, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter(v => v !== optionValue));
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <S.Container className={className} ref={containerRef}>
        {label && (
          <S.Label required={required}>
            {label}
            {required && <S.Required>*</S.Required>}
          </S.Label>
        )}

        <S.Wrapper
          focused={isFocused}
          error={isError}
          disabled={disabled}
          isOpen={isOpen}
          onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {value.length > 0 ? (
            value.map(val => {
              const option = options.find(o => o.value === val);
              return (
                <S.SelectedItem key={val}>
                  {option?.label}
                  {!disabled && !readOnly && (
                    <S.RemoveButton
                      onClick={e => removeOption(val, e)}
                      aria-label={`Remove ${option?.label}`}
                    >
                      ✕
                    </S.RemoveButton>
                  )}
                </S.SelectedItem>
              );
            })
          ) : (
            <S.Placeholder>{placeholder}</S.Placeholder>
          )}

          <S.ChevronIcon>▼</S.ChevronIcon>
        </S.Wrapper>

        <S.DropdownList isOpen={isOpen}>
          {searchable && (
            <li style={{ padding: '8px' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              />
            </li>
          )}
          {filteredOptions.map(option => (
            <S.DropdownItem
              key={option.value}
              isSelected={value.includes(option.value)}
              isDisabled={option.disabled}
              onClick={() =>
                !option.disabled && !disabled && !readOnly && handleToggleOption(option.value)
              }
            >
              <S.Checkbox
                type="checkbox"
                checked={value.includes(option.value)}
                disabled={option.disabled || disabled || readOnly}
                onChange={() => {}}
                onClick={e => e.stopPropagation()}
              />
              <span>{option.label}</span>
            </S.DropdownItem>
          ))}
          {filteredOptions.length === 0 && (
            <li style={{ padding: '12px 8px', textAlign: 'center', color: '#999' }}>
              No options found
            </li>
          )}
        </S.DropdownList>

        {(helperText || isError) && (
          <S.HelperText error={isError} id={`${props.id}-helper`}>
            {error && typeof error === 'string' ? error : helperText}
          </S.HelperText>
        )}
      </S.Container>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;
