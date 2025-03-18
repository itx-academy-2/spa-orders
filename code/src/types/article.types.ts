export interface Article {
  id: number;
  title: string;
}

export interface ArticleDetails extends Article {
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  empty: boolean;
  content: Article[];
}
