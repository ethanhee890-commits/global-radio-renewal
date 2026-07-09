import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve('src/GlobalRadioApp.tsx'), 'utf8');

describe('player bottom sheet drag wiring', () => {
  it('keeps drag move and release handlers on the sheet shell as a fallback', () => {
    const sheetStart = source.indexOf('className={`player-bottom-sheet');
    expect(sheetStart).toBeGreaterThanOrEqual(0);

    const sheetOpenTag = source.slice(sheetStart, source.indexOf('style={{ transform', sheetStart));
    expect(sheetOpenTag).toContain('onPointerMove={moveSheetDrag}');
    expect(sheetOpenTag).toContain('onPointerUp={endSheetDrag}');
    expect(sheetOpenTag).toContain('onPointerCancel={endSheetDrag}');
  });
});
