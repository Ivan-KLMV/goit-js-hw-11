import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const API_KEY = '34585976-51a68d3a5f9444fd8119e93c8';
const formSearchEl = document.querySelector('#search-form');
const gallaryBlock = document.querySelector('div.gallery');
const galleryLightBox = new SimpleLightbox('.gallery a');

axios.defaults.baseURL = 'https://pixabay.com/api/';
console.log(formSearchEl);
formSearchEl.addEventListener('submit', searchPhoto);

function searchPhoto(evt) {
  evt.preventDefault();
  const inputVlue = evt.target.elements.searchQuery.value;
  console.log(evt.target.elements.searchQuery.value);

  if (!inputVlue) {
    console.log('pusto');
    return;
  }
  axios
    .get(
      `?key=${API_KEY}&q=${inputVlue}s&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`
    )
    .then(res =>
      gallaryBlock.insertAdjacentHTML(
        'afterbegin',
        createPhotoCard(res.data.hits)
      )
    )
    .then(() => {
      galleryLightBox.refresh();
    });
}

function createPhotoCard(photoResponse) {
  gallaryBlock.innerHTML = '';
  return photoResponse
    .map(photo => {
      return `<a href="${photo.largeImageURL}">
      <div class="photo-card">
  <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${photo.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${photo.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${photo.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${photo.downloads}</span>
    </p>
  </div>
</div>
</a>`;
    })
    .join('');
}

// new simpleLightbox('gallery a');
// {
//   collections: 1315;
//   comments: 136;
//   downloads: 332960;
//   id: 887272;
//   imageHeight: 3840;
//   imageSize: 2128873;
//   imageWidth: 5760;
//   largeImageURL: 'https://pixabay.com/get/g6487896fed8c57593dcc6994942eefbf79782d9d36e43a15293b1cbceb85028d25f12cf9bad10169bc36d2127e312d662589f67ed2232434663ca71e2114d965_1280.jpg';
//   likes: 1231;
//   pageURL: 'https://pixabay.com/photos/vintage-1950s-pretty-woman-887272/';
//   previewHeight: 99;
//   previewURL: 'https://cdn.pixabay.com/photo/2015/08/13/17/24/vintage-1950s-887272_150.jpg';
//   previewWidth: 150;
//   tags: 'vintage 1950s, pretty woman, vintage car';
//   type: 'photo';
//   user: 'JillWellington';
//   userImageURL: 'https://cdn.pixabay.com/user/2018/06/27/01-23-02-27_250x250.jpg';
//   user_id: 334088;
//   views: 497211;
//   webformatHeight: 426;
//   webformatURL: 'https://pixabay.com/get/g5f35d22248561fa697f6a5f34a485c84d7ce3101b7dc113560486d47d3aecd46c196269caf9c3501f00ce29d07b63505_640.jpg';
//   webformatWidth: 640;
// }
