import React, { useState, forwardRef } from 'react';
import * as S from './TagInput.styles';

interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  separator?: string | RegExp;
  maxTags?: number;
  className?: string;
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({
    label,
    placeholder = 'Add tags...',
    value = [],
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    separator = /[\s,]+/,
    maxTags,
    className = '',
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const isError = !!error;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!readOnly && !disabled) {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          addTag(inputValue.trim());
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
          removeTag(value.length - 1);
        }
      }
    };

    const addTag = (tag: string) => {
      if (!tag || (maxTags && value.length >= maxTags)) {
        setInputValue('');
        return;
      }

      if (!value.includes(tag)) {
        onChange([...value, tag]);
      }
      setInputValue('');
    };

    const removeTag = (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // Add remaining input as tag
      if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    };

    return (
      <S.Container className={className}>
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
        >
          {value.map((tag, index) => (
            <S.Tag key={`${tag}-${index}`}>
              {tag}
              {!disabled && !readOnly && (
                <S.RemoveTagButton
                  onClick={() => removeTag(index)}
                  aria-label={`Remove tag ${tag}`}
                >
                  ✕
                </S.RemoveTagButton>
              )}
            </S.Tag>
          ))}

          <S.Input
            ref={ref}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            disabled={disabled || (maxTags && value.length >= maxTags)}
            readOnly={readOnly}
            aria-label={label || 'Tags'}
            aria-required={required}
            aria-invalid={isError}
            aria-describedby={helperText || error ? `${props.id}-helper` : undefined}
            {...props}
          />
        </S.Wrapper>

        {(helperText || isError) && (
          <S.HelperText error={isError} id={`${props.id}-helper`}>
            {error && typeof error === 'string' ? error : helperText}
          </S.HelperText>
        )}
      </S.Container>
    );
  }
);

TagInput.displayName = 'TagInput';

export default TagInput;
