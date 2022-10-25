import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import axios from 'axios';
import cardTemplate from './templates/cardTemplate.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30528921-8e859357d7a6bf61cd9b66029';
const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const searchInputEl = formEl.elements.searchQuery;
let searchQuery = '';
const loadMoreBtn = document.querySelector('.js-loadmore');
const itemsPerPage = 20;
let currentPage = 1;

var lightbox = new SimpleLightbox('.gallery a');

const defaultParams = {
   image_type: 'photo',
   orientation: 'horizontal',
   safesearch: true,
};

document.cookie = 'witcher=Geralt; SameSite=None; Secure';

async function fetchAPI(query) {
   try {
      const { data } = await axios.get(BASE_URL, {
         params: {
            key: API_KEY,
            q: query.trim(),
            page: currentPage,
            per_page: itemsPerPage,
            ...defaultParams,
         },
         headers: {
            SameSite: 'none',
         },
      });
      return data;
   } catch (error) {
      console.log(`${error} - but it doesn't really do anything`);
   }
}

function scrollToTheLastRow() {
   const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

   window.scrollBy({
      top: cardHeight * 5,
      behavior: 'smooth',
   });
}

function renderUI({ hits, totalHits }, inputValue) {
   hits.length
      ? (gallery.innerHTML += hits.map(elem => cardTemplate(elem)).join(''))
      : Notify.failure(`There's no results that match ${inputValue} query`);

   currentPage * itemsPerPage < totalHits
      ? loadMoreBtn.classList.remove('hide')
      : loadMoreBtn.classList.add('hide');

   lightbox.refresh();
}

formEl.addEventListener('submit', e => {
   e.preventDefault();
   searchQuery = searchInputEl.value;

   gallery.innerHTML = '';

   fetchAPI(searchQuery).then(data => {
      renderUI(data, searchQuery);
   });
});

function getNextPage() {
   currentPage += 1;
   fetchAPI(searchQuery).then(data => {
      renderUI(data, searchQuery);
      scrollToTheLastRow();
   });
}

loadMoreBtn.addEventListener('click', getNextPage);
