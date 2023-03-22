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

function searchPhoto(evt) {
  evt.preventDefault();
  resetPage();
  const inputVlue = evt.target.elements.searchQuery.value.trim();

  if (!inputVlue) {
    console.log('pusto');
    return;
  }
  axios
    .get(
      `?key=${API_KEY}&q=${inputVlue}s&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
    .then(res => {
      if (res.data.hits.length === 0) {
        return notifyFailure();
      }
      notifyInfo(res.data.totalHits);
      // increasePage();
      creaetCard(res.data.hits);
    })
    .then(() => {
      galleryLightBox.refresh();
    })
    .catch(console.error);
}

function increasePage() {
  page += 1;
}

function resetPage(params) {
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
