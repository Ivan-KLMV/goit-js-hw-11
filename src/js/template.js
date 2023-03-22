export function createCardTmplt(response) {
  // gallaryBlock.innerHTML = '';
  return response
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
