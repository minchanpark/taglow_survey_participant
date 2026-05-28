import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import './css/Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
};

export function Button({ variant = 'primary', fullWidth = false, leadingIcon, className, children, ...buttonProps }: ButtonProps) {
  const classes = ['ui-button', `ui-button--${variant}`, fullWidth ? 'ui-button--full' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...buttonProps}>
      {leadingIcon ? <span className="ui-button__icon">{leadingIcon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function ButtonLink({ variant = 'primary', fullWidth = false, className, children, ...anchorProps }: ButtonLinkProps) {
  const classes = ['ui-button', `ui-button--${variant}`, fullWidth ? 'ui-button--full' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <a className={classes} {...anchorProps}>
      <span>{children}</span>
    </a>
  );
}
