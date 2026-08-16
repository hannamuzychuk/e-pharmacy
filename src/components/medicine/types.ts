export type Review = {
  id: string;
  author: string;
  date: string;
  text: string;
};

export type DescriptionBlock = {
  title?: string;
  text: string;
};

export type Medicine = {
  id: string;
  name: string;
  supplier: string;
  price: string;
  image: string;
  description: DescriptionBlock[];
  reviews: Review[];
};
