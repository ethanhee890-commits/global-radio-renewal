import { describe, expect, it } from 'vitest';
import { __filterBarTestHooks } from '../components/FilterBar';
import type { RadioBrowserFilterOption } from '../lib/radioBrowser';

const globalTags: RadioBrowserFilterOption[] = [
  { label: '전체', value: '' },
  { label: 'Jazz', value: 'jazz' },
  { label: 'News', value: 'news' },
  { label: 'Lofi', value: 'lofi' }
];

describe('FilterBar option rules', () => {
  it('does not show Japan-only genres when the country filter is global', () => {
    const optionLabels = __filterBarTestHooks.getGenreOptions('', globalTags).map((option) => option.label);

    expect(optionLabels).not.toContain('일본 추천');
    expect(optionLabels).not.toContain('공개 FM');
    expect(optionLabels).not.toContain('NHK/뉴스');
    expect(optionLabels).toContain('Jazz');
    expect(optionLabels).toContain('News');
  });

  it('shows Japan-specific genres only for Japan searches', () => {
    const optionLabels = __filterBarTestHooks.getGenreOptions('JP', globalTags).map((option) => option.label);

    expect(optionLabels).toEqual(expect.arrayContaining(['일본 추천', '공개 FM', 'NHK/뉴스', 'Jazz']));
  });
});
