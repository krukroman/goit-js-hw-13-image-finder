const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';
const API_KEY = '22968380-c77365a0aacae74fb17ed9f87';

export default class FetchImages {
  constructor() {
    this.searchQuery = '';
    this.pageNumber = 1;
  }

  async fetchImagesColletion() {
    const url = `${BASE_URL}&q=${this.searchQuery}&page=${this.pageNumber}&per_page=12&key=${API_KEY}`;

    const response = await fetch(url);
    const imagesCollection = await response.json();
    return imagesCollection;
  }

  pageNumberIncrement() {
    this.pageNumber += 1;
  }

  pageNumberReset() {
    this.pageNumber = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
