export type ImageClientPoint = Readonly<{
  clientX: number;
  clientY: number;
}>;

export type ImageRatio = Readonly<{
  xRatio: number;
  yRatio: number;
}>;

export function calculateImageRatio(point: ImageClientPoint, imageRect: DOMRect | Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>): ImageRatio {
  return {
    xRatio: clampRatio((point.clientX - imageRect.left) / imageRect.width),
    yRatio: clampRatio((point.clientY - imageRect.top) / imageRect.height),
  };
}

export function clampRatio(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1);
}
