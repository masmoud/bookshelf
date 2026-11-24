export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  subject?: string[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: Book[];
}

export interface BookDetailsData {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  subject?: string[];
  description?: string;
}

export interface OpenLibraryWorkResponse {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  authors?: {
    author: {
      key: string;
    };
  }[];
}

export interface OpenLibraryAuthorResponse {
  name?: string;
}

export interface OpenLibraryEditionsResponse {
  size: number;
}
