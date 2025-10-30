interface Book {
  id: number,
  name: string,
  author: string,
  editor: string,
  year: number,
  read: boolean,
  favorite: boolean,
  rating: number,
  cover: string | null,
  theme: string
}

export type { Book }
