// Common types used across all applications

export interface Language {
  code: string;
  name: string;
  direction: string;
}

export interface Folder {
  folder_id: number;
  name: string;
  add_class: string;
  nbooks: number;
  naudiobooks: number;
  sort: number;
  children?: Folder[];
}

export interface Book {
  book_id: number;
  code: string;
  lang: string;
  type: string;
  subtype: string;
  title: string;
  first_para: string;
  author: string;
  description: string;
  npages: number;
  isbn?: string;
  publisher: string;
  pub_year: string;
  buy_link?: string;
  folder_id: number;
  folder_color_group: string;
  cover: {
    small: string;
    large: string;
  };
  files: {
    mp3?: string;
    pdf: string;
    epub: string;
    mobi: string;
  };
  download: string;
  last_modified: string;
  permission_required: string;
  sort: number;
  is_audiobook: boolean;
  cite: string;
  original_book?: string;
  translated_into: string[];
  nelements: number;
}

export interface Chapter {
  id: number;
  title: string;
  bookId: number;
  order: number;
  paragraphCount: number;
}

export interface Paragraph {
  para_id: string;
  id_prev?: string;
  id_next?: string;
  refcode_1: string;
  refcode_2: string;
  refcode_3: string;
  refcode_4: string;
  refcode_short: string;
  refcode_long: string;
  element_type: string;
  element_subtype: string;
  content: string;
  puborder: number;
  translations: any[];
}

export interface SearchHit {
  index: number;
  lang: string;
  para_id: string;
  book_id: number;
  pub_code: string;
  pub_name: string;
  author: string;
  refcode_long: string;
  refcode_short: string;
  pub_year: string;
  snippet: string;
  weight: number;
  group: string;
}

export interface SearchResult {
  next: string | null;
  previous: string | null;
  total: number;
  count: number;
  results: SearchHit[];
}