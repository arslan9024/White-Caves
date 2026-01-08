import React from 'react';
import './layout.css';

const Section = React.memo(({
  children,
  title,
  subtitle,
  padding = 'large',
  background = 'transparent',
  className = '',
  headerActions,
  ...props
}) => {
  const baseClass = 'wc-section';
  const classes = [
    baseClass,
    `${baseClass}--padding-${padding}`,
    `${baseClass}--bg-${background}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={classes} {...props}>
      {(title || subtitle || headerActions) && (
        <div className={`${baseClass}__header`}>
          <div className={`${baseClass}__header-text`}>
            {title && <h2 className={`${baseClass}__title`}>{title}</h2>}
            {subtitle && <p className={`${baseClass}__subtitle`}>{subtitle}</p>}
          </div>
          {headerActions && (
            <div className={`${baseClass}__header-actions`}>
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className={`${baseClass}__content`}>
        {children}
      </div>
    </section>
  );
});

Section.displayName = 'Section';

export default Section;
