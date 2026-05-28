import type { PropsWithChildren, ReactNode } from 'react';

import './css/Message.css';

type MessageTone = 'info' | 'success' | 'warning' | 'error';

type MessageProps = PropsWithChildren<{
  tone?: MessageTone;
  title: string;
  action?: ReactNode;
}>;

export function Message({ tone = 'info', title, action, children }: MessageProps) {
  return (
    <section className={`ui-message ui-message--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <div className="ui-message__body">
        <h2 className="ui-message__title">{title}</h2>
        {children ? <div className="ui-message__content">{children}</div> : null}
      </div>
      {action ? <div className="ui-message__action">{action}</div> : null}
    </section>
  );
}
