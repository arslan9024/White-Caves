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

const Section = React.memo(({
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
