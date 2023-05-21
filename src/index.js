import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Loading, Notify } from 'notiflix';
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
// loadMoreBtn.addEventListener('click', loadMorePhoto);

async function searchPhoto(evt) {
  // hideLoadMoreBtn();
  resetPage();
  evt.preventDefault();
  inputValue = evt.target.elements.searchQuery.value
    .trim()
    .split(' ')
    .join('+');

  if (!inputValue) {
    return;
  }
  clearTmplt();
  const response = await getResponse(API_KEY, inputValue, page);
  const photoLoader = async res => {
    try {
      if (res.data.hits.length === 0) {
        return notifyFailure();
      }
      // showLoadMoreBtn();
      increasePage();
      notifyInfo(res.data.totalHits);
      createCard(res.data.hits);
      infiniteScroll();
    } catch (error) {
      console.error(error);
    }
  };

  return await photoLoader(response);
}

async function loadMorePhoto() {
  const response = await getResponse(API_KEY, inputValue, page);
  const photoLoader = async res => {
    try {
      if (res.data.hits.length === 0) {
        // hideLoadMoreBtn();
        notitfyEndOfList();
        return;
      }
      increasePage();
      createCard(res.data.hits);
      // smoothScroll();
      infiniteScroll();
    } catch {
      notitfyEndOfList();
    }
  };

  return await photoLoader(response);
}

function infiniteScroll() {
  const lastPhoto = gallaryBlock.lastElementChild;
  const { height: lastPhotoHeight } = lastPhoto.getBoundingClientRect();
  const GalleryObserver = new IntersectionObserver(
    ([entrie], observer) => {
      console.log(entrie);
      console.log(observer);
      console.log(lastPhotoHeight);

      if (entrie.isIntersecting) {
        loadMorePhoto();
        // console.log('isIntersecting OK');
        observer.unobserve(entrie.target);
      }
    },
    { rootMargin: `0px 0px ${lastPhotoHeight * 2}px 0px`, threshold: 0.1 }
  );

  // GalleryObserver.observe(gallaryBlock.lastElementChild);

  if (lastPhoto) {
    GalleryObserver.observe(lastPhoto);
  }
}

function smoothScroll() {
  const { height: cardHeight } =
    gallaryBlock.firstElementChild.getBoundingClientRect();
  // console.log(gallaryBlock.firstElementChild.getBoundingClientRect());

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
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

function createCard(hits) {
  gallaryBlock.insertAdjacentHTML('beforeend', createCardTmplt(hits));
  galleryLightBox.refresh();
}

function clearTmplt() {
  return (gallaryBlock.innerHTML = '');
}

function getResponse(key, input, page) {
  return axios.get(
    `?key=${key}&q=${input}s&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
}

// function showLoadMoreBtn() {
//   loadMoreBtn.removeAttribute('hidden');
// }

// function hideLoadMoreBtn() {
//   loadMoreBtn.setAttribute('hidden', true);
// }
