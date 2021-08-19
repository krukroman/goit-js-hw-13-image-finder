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
    onEmptyString();
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

      onNotFound();

      return;
    } else if (images.hits.length < 12) {
      loadMoreBtn.hide();

      onItsAll();
    }
    refs.galleryList.insertAdjacentHTML('beforeend', galleryTMP(images));

    apiService.pageNumberIncrement();

    loadMoreBtn.enable();

    onScroll();

    if (refs.galleryList.children.length > 12) {
      onTopBtn.show();
    }
  } catch (error) {
    onPromiseEroor(error);

    loadMoreBtn.hide();
  }
}

function clearGalleryMarkup() {
  refs.galleryList.innerHTML = '';
}

function onScroll() {
  loadMoreBtn.refs.button.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function openModal(e) {
  e.preventDefault();
  const url = e.target.dataset.source;
  createModal(url);
  onOpenModal();
}

function scrollToTop() {
  refs.searchForm.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function onEmptyString() {
  notify({
    title: 'Empty string!!!',
    text: 'Please enter correct search query',
    type: 'error',
    delay: 3000,
  });
}

function onNotFound() {
  notify({
    text: 'По вашему запросу ничего ненайдено. Введите другой запрос',
    type: 'error',
    animation: 'fade',
    delay: 3000,
    autoOpen: 'false',
  });
}

function onItsAll() {
  notify({
    text: 'Это всё, что было найдено по вашему запросу',
    type: 'error',
    animation: 'fade',
    delay: 3000,
    autoOpen: 'false',
  });
}

function onPromiseEroor(error) {
  notify({
    title: 'Something goes wrong',
    text: `${error.stack}`,
    type: 'error',
    animation: 'fade',
    delay: 3000,
    autoOpen: 'false',
  });
}

function onOpenModal() {
  notify({
    text: `Для закрытия модального окна нажмите на темную область`,
    type: 'error',
    animation: 'fade',
    delay: 3000,
    autoOpen: 'false',
  });
}
