import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const fetchButton = document.querySelector('.load');
const gallery = document.querySelector('.gallery');
const keyApi = '42511097-6652c7dec9d248f72a6de25eb';

let page = 1;
let currentQuery = '';
let displayImages = 0;
let lightbox;
let perPage = 40;

const searchParams = new URLSearchParams({
  key: keyApi,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: page,
  per_page: perPage,
});

const fetchPhotos = async () => {
  searchParams.set('q', form.elements[0].value.split(' ').join('+'));
  searchParams.set('page', page);
  const res = await axios.get(`https://pixabay.com/api/?${searchParams}`);
  return res.data;
};

function galleryPhotos(data, append = false) {
  if (data.hits.lenght <= 0) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    gallery.innerHTML = '';
  } else {
    const markup = data.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<div class="photo-card"><a class="gallery__item" href="${largeImageURL}">
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div>`
      )
      .join('');

    if (append) {
      gallery.innerHTML + -markup;
    } else {
      gallery.innerHTML = markup;
    }
    lightbox = new simpleLightbox('.gallery a');
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const phrase = form.elements[0].value.trim();

  if (phrase === '') {
    Notiflix.Notify.warning('Please enter a phrase.');
    return;
  } else if (phrase !== currentQuery) {
    currentQuery = phrase;
    page = 1;
  }

  try {
    const images = await fetchPhotos(form, page);
    totalHits = images.totalHits;
    galleryPhotos(images);

    if (images.hits.length === 0) {
      fetchButton.classList.add('hidden');
    } else if (images.hits.length < 40) {
      fetchButton.classList.add('hidden');
      const dataHits = images.totalHits;
      Notiflix.Notify.success(`Hooray! We found ${dataHits} images.`);
    } else {
      fetchButton.classList.remove('hidden');
      const dataHits = photos.totalHits;
      Notiflix.Notify.success(`Hooray! We found ${dataHits} images.`);
    }
  } catch (error) {
    Notiflix.Notify.failure(`ERROR: ${error}`);
  }
});

fetchButton.addEventListener('click', async () => {
  ++page;
  try {
    const images = await fetchPhotos();
    galleryPhotos(images, true);
    loadPhotos(images.hits.lenght);
    if (images.hits.lenght === 0) {
      fetchButton.classList.add('hidden');
    }
  } catch (error) {
    Notiflix.Notify.failure(`Error: ${error}`);
  }
});

function loadPhotos() {
  if (page * 40 >= totalHits) {
    fetchButton.classList.add('hidden');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    fetchButton.classList.remove('hidden');
  }
}
