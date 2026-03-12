import React from 'react';
import {
  StyledSection,
  SectionHeader,
  SectionHeaderText,
  SectionTitle,
  SectionSubtitle,
  SectionHeaderActions,
  SectionContent,
} from './Section.styles';

/** Padding size tokens (matches Section.styles.ts PaddingSize) */
export type SectionPaddingSize = 'none' | 'small' | 'medium' | 'large';
/** Background variants (matches Section.styles.ts BackgroundVariant) */
export type SectionBackgroundVariant = 'transparent' | 'primary' | 'secondary' | 'accent';

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Child elements rendered inside the section content area */
  children?: React.ReactNode;
  /** Section title text */
  title?: React.ReactNode;
  /** Section subtitle text */
  subtitle?: React.ReactNode;
  /** Padding size token */
  padding?: SectionPaddingSize;
  /** Background color token */
  background?: SectionBackgroundVariant;
  /** Minimum height */
  minHeight?: string;
  /** Maximum width */
  maxWidth?: string;
  /** Actions rendered in the section header */
  headerActions?: React.ReactNode;
}

const Section = React.memo<SectionProps>(({
  children,
  title,
  subtitle,
  padding = 'large',
  background = 'transparent',
  minHeight,
  maxWidth,
  className = '',
  headerActions,
  ...props
}) => {
  return (
    <StyledSection
      $padding={padding}
      $background={background}
      $minHeight={minHeight}
      $maxWidth={maxWidth}
      className={className}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <SectionHeader>
          <SectionHeaderText>
            {title && <SectionTitle>{title}</SectionTitle>}
            {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
          </SectionHeaderText>
          {headerActions && (
            <SectionHeaderActions>
              {headerActions}
            </SectionHeaderActions>
          )}
        </SectionHeader>
      )}
      <SectionContent>
        {children}
      </SectionContent>
    </StyledSection>
  );
});

Section.displayName = 'Section';

export default Section;
