import type { PropsWithChildren } from 'react';

import { ButtonLink } from '../../../components/Button';
import './SystemStatePage.css';

type SystemStatePageProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}>;

export function SystemStatePage({ eyebrow, title, description, actionHref, actionLabel, children }: SystemStatePageProps) {
  return (
    <main className="system-state-page">
      <section className="system-state-page__content">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
        {children ? <div className="system-state-page__extra">{children}</div> : null}
        {actionHref && actionLabel ? (
          <ButtonLink href={actionHref} variant="secondary">
            {actionLabel}
          </ButtonLink>
        ) : null}
      </section>
    </main>
  );
}
