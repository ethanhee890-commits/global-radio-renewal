import { Globe2, Languages, SlidersHorizontal, Tag } from 'lucide-react';

export type RadioFilters = {
  country: string;
  language: string;
  tag: string;
  sort: 'quality' | 'popular' | 'name';
};

const COUNTRY_OPTIONS = [
  { label: '전체', value: '' },
  { label: '한국', value: 'Korea' },
  { label: '일본', value: 'Japan' },
  { label: '미국', value: 'United States' },
  { label: '영국', value: 'United Kingdom' }
];

const LANGUAGE_OPTIONS = [
  { label: '전체', value: '' },
  { label: '한국어', value: 'korean' },
  { label: '영어', value: 'english' },
  { label: '일본어', value: 'japanese' },
  { label: '음악 중심', value: 'instrumental' }
];

const GENRE_OPTIONS = [
  { label: '전체', value: '' },
  { label: '일본 추천', value: 'japan-priority' },
  { label: '공개 FM', value: 'terrestrial-fm' },
  { label: 'NHK/뉴스', value: 'nhk' },
  { label: 'Jazz', value: 'jazz' },
  { label: 'News', value: 'news' },
  { label: 'Lofi', value: 'lofi' },
  { label: 'Talk', value: 'talk' }
];

export function FilterBar({
  filters,
  onChange
}: {
  filters: RadioFilters;
  onChange: (filters: RadioFilters) => void;
}) {
  return (
    <section className="filter-bar" aria-label="방송국 필터">
      <label>
        <span>
          <Globe2 aria-hidden="true" size={15} />
          국가
        </span>
        <select value={filters.country} onChange={(event) => onChange({ ...filters, country: event.target.value })}>
          {COUNTRY_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>
          <Languages aria-hidden="true" size={15} />
          언어
        </span>
        <select value={filters.language} onChange={(event) => onChange({ ...filters, language: event.target.value })}>
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>
          <Tag aria-hidden="true" size={15} />
          장르
        </span>
        <select value={filters.tag} onChange={(event) => onChange({ ...filters, tag: event.target.value })}>
          {GENRE_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>
          <SlidersHorizontal aria-hidden="true" size={15} />
          정렬
        </span>
        <select value={filters.sort} onChange={(event) => onChange({ ...filters, sort: event.target.value as RadioFilters['sort'] })}>
          <option value="quality">품질순</option>
          <option value="popular">인기순</option>
          <option value="name">이름순</option>
        </select>
      </label>
    </section>
  );
}
