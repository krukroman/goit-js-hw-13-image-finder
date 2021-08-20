import API from './apiService';
import getRefs from './get-refs';
import LoadMoreBtn from './load-more-btn';
import OnTopBtn from './on-top-btn';
import galleryTMP from '../templates/gallery.hbs';
import createModal from './lightbox';
import notify from './notify';

const apiService = new API();

const refs = getRefs();

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more-btn',
  hidden: true,
});

const onTopBtn = new OnTopBtn({
  selector: '.on-top-btn',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);

loadMoreBtn.refs.button.addEventListener('click', appendGalleryMarkup);

onTopBtn.refs.button.addEventListener('click', scrollToTop);

refs.galleryList.addEventListener('click', openModal);

function onSearch(e) {
  e.preventDefault();
  apiService.query = e.currentTarget.elements.query.value;

  if (apiService.query.length === 0 || !apiService.query.trim()) {
    notify('Пустая строка. Пожалуйста введите запрос');
    return;
  }

  loadMoreBtn.show();

  apiService.pageNumberReset();

  clearGalleryMarkup();

  appendGalleryMarkup();
}

async function appendGalleryMarkup() {
  loadMoreBtn.disable();

  try {
    const images = await apiService.fetchImagesColletion({});

    if (images.total === 0) {
      loadMoreBtn.hide();

      notify('По вашему запросу ничего ненайдено. Введите другой запрос');

      return;
    } else if (images.hits.length < 12) {
      loadMoreBtn.hide();

      notify('Это всё, что было найдено по вашему запросу');
    }
    refs.galleryList.insertAdjacentHTML('beforeend', galleryTMP(images));

    apiService.pageNumberIncrement();

    loadMoreBtn.enable();

    scrollToBottom();

    if (refs.galleryList.children.length > 12) {
      onTopBtn.show();
    } else onTopBtn.hide();
  } catch (error) {
    notify(`${error.stack}`);

    loadMoreBtn.hide();
  }
}

function clearGalleryMarkup() {
  refs.galleryList.innerHTML = '';
}

function scrollToBottom() {
  loadMoreBtn.refs.button.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function openModal(e) {
  e.preventDefault();
  if (!e.target.classList.contains('js-gallery-img')) return;
  const url = e.target.dataset.source;
  createModal(url);
  notify('Для закрытия модального окна нажмите на темную область');
}

function scrollToTop() {
  refs.searchForm.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}
