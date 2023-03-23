import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import { createCardTmplt } from './js/template';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '34585976-51a68d3a5f9444fd8119e93c8';
const formSearchEl = document.querySelector('#search-form');
const gallaryBlock = document.querySelector('div.gallery');
const galleryLightBox = new SimpleLightbox('.gallery a');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

axios.defaults.baseURL = 'https://pixabay.com/api/';

formSearchEl.addEventListener('submit', searchPhoto);
loadMoreBtn.addEventListener('click', searchPhoto);

function searchPhoto(evt) {
  evt.preventDefault();
  const inputValue = evt.target.elements.searchQuery.value.trim();

  if (!inputValue) {
    return;
  }
  clearTmplt();
  return getReqest(API_KEY, inputValue, page);
}

function increasePage() {
  page += 1;
}

function resetPage() {
  page = 1;
}

function notifyInfo(totalHits) {
  Notify.info(`"Hooray! We found ${totalHits} images.`);
}

function notifyFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function creaetCard(hits) {
  gallaryBlock.insertAdjacentHTML('beforeend', createCardTmplt(hits));
}

function clearTmplt() {
  return (gallaryBlock.innerHTML = '');
}
function getReqest(key, input, page) {
  return axios
    .get(
      `?key=${key}&q=${input}s&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
    .then(res => {
      if (res.data.hits.length === 0) {
        return notifyFailure();
      }
      notifyInfo(res.data.totalHits);
      creaetCard(res.data.hits);
    })
    .then(() => {
      galleryLightBox.refresh();
    })
    .catch(console.error);
}
