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
const perPage = 40;
let page = 1;
let inputValue = '';

axios.defaults.baseURL = 'https://pixabay.com/api/';

formSearchEl.addEventListener('submit', searchPhoto);
loadMoreBtn.addEventListener('click', loadMorePhoto);

function searchPhoto(evt) {
  resetPage();
  evt.preventDefault();
  inputValue = evt.target.elements.searchQuery.value.trim();

  if (!inputValue) {
    return;
  }
  clearTmplt();
  return getResponse(API_KEY, inputValue, page)
    .then(res => {
      if (res.data.hits.length === 0) {
        return notifyFailure();
      }
      loadMoreBtn.removeAttribute('hidden');
      increasePage();
      notifyInfo(res.data.totalHits);
      creaetCard(res.data.hits);
    })
    .then(() => {
      galleryLightBox.refresh();
    })
    .catch(console.error);
}

function loadMorePhoto() {
  return getResponse(API_KEY, inputValue, page)
    .then(res => {
      // console.log(res);
      // if (res.data.status === 400) {
      //   console.log(res.data.hits.length < perPage);
      //   return;
      // }
      increasePage();
      creaetCard(res.data.hits);
    })
    .then(() => {
      galleryLightBox.refresh();
    })
    .catch(error => {
      loadMoreBtn.setAttribute('hidden', true);
      galleryLightBox.refresh();
      return notitfyEndOfList();
    });
}

function increasePage() {
  page += 1;
}

function resetPage() {
  page = 1;
}

function notifyInfo(totalHits) {
  Notify.success(`"Hooray! We found ${totalHits} images.`);
}

function notitfyEndOfList() {
  Notify.info("We're sorry, but you've reached the end of search results.");
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

function getResponse(key, input, page) {
  return axios.get(
    `?key=${key}&q=${input}s&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
}
