import { Button } from '../../../../components/Button';
import './css/DraftRestoreBanner.css';

type DraftRestoreBannerProps = {
  updatedAt: string;
  onRestore: () => void;
  onRestart: () => void;
};

export function DraftRestoreBanner({ updatedAt, onRestore, onRestart }: DraftRestoreBannerProps) {
  return (
    <section className="draft-restore-banner">
      <div>
        <h2>이전에 작성하던 응답이 있습니다.</h2>
        <p>{updatedAt ? `${updatedAt}에 저장되었습니다.` : '같은 브라우저에서 저장된 응답입니다.'}</p>
      </div>
      <div className="draft-restore-banner__actions">
        <Button type="button" variant="secondary" onClick={onRestart}>
          처음부터
        </Button>
        <Button type="button" onClick={onRestore}>
          이어서 작성
        </Button>
      </div>
    </section>
  );
}
