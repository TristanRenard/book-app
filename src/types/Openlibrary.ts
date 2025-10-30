export interface OpenLibrarySearchResponse {
  numFound: number
  start: number
  numFoundExact: boolean
  docs: OpenLibraryBook[]
  num_found: number
  q: string
  offset: number | null
}

export interface OpenLibraryBook {
  key: string
  type: string
  seed: string[]
  title: string
  title_suggest: string
  title_sort: string
  edition_count: number
  edition_key: string[]
  publish_date: string[]
  publish_year: number[]
  first_publish_year: number
  number_of_pages_median: number
  lccn: string[]
  publish_place: string[]
  oclc: string[]
  contributor: string[]
  lcc: string[]
  ddc: string[]
  isbn: string[]
  last_modified_i: number
  ebook_count_i: number
  ebook_access: string
  has_fulltext: boolean
  public_scan_b: boolean
  ia: string[]
  ia_collection: string[]
  ia_collection_s: string
  lending_edition_s: string
  lending_identifier_s: string
  printdisabled_s: string
  cover_edition_key: string
  cover_i: number
  publisher: string[]
  language: string[]
  author_key: string[]
  author_name: string[]
  author_alternative_name?: string[]
  subject: string[]
  person: string[]
  place: string[]
  time: string[]
  id_goodreads?: string[]
  id_librarything?: string[]
  id_project_gutenberg?: string[]
  id_amazon?: string[]
  id_depósito_legal?: string[]
  id_google?: string[]
  id_alibris_id?: string[]
  id_better_world_books?: string[]
  id_overdrive?: string[]
  id_paperback_swap?: string[]
  id_wikidata?: string[]
  ia_box_id?: string[]
  publisher_facet: string[]
  person_key?: string[]
  place_key?: string[]
  time_facet?: string[]
  subject_facet: string[]
  _version_: number
  lcc_sort?: string
  author_facet: string[]
  subject_key: string[]
  ddc_sort?: string
  first_sentence?: string[]
}


export interface OpenLibrarySearchParams {
  title?: string
  author?: string
  isbn?: string
  subject?: string
  place?: string
  person?: string
  publisher?: string
  q?: string
  limit?: number
  offset?: number
  fields?: string
  sort?: string
  lang?: string
}