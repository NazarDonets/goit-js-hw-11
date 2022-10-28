import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import cardTemplate from './templates/cardTemplate.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchAPI from './api-service.js';

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const searchInputEl = formEl.elements.searchQuery;
const submitBtnText = document.querySelector('.submit-btn__text');
const loadMoreBtn = document.querySelector('.js-loadmore');
const loadMoreBtnText = document.querySelector('.js-loadmore__text');
const loaderLoadMoreBtnEl = document.querySelector('.loader-container');
const loaderSubmitBtnEl = document.querySelector(
   '.loader-container__submit-btn'
);
let searchQuery = '';
export const itemsPerPage = 40;
export let currentPage = 1;

var lightbox = new SimpleLightbox('.gallery a');

function scrollToTheLastRow() {
   const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

   window.scrollBy({
      top: cardHeight * 3,
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

function getFirstResults(e) {
   e.preventDefault();
   searchQuery = searchInputEl.value;
   gallery.innerHTML = '';
   submitBtnText.textContent = '';
   loaderSubmitBtnEl.classList.remove('hide');
   fetchAPI(searchQuery).then(data => {
      renderUI(data, searchQuery);
      submitBtnText.textContent = 'search';
      loaderSubmitBtnEl.classList.add('hide');
   });
}

function getNextPage() {
   currentPage += 1;
   loadMoreBtnText.textContent = 'loading';
   loaderLoadMoreBtnEl.classList.remove('hide');
   fetchAPI(searchQuery).then(data => {
      renderUI(data, searchQuery);
      scrollToTheLastRow();
      loadMoreBtnText.textContent = 'load more';
      loaderLoadMoreBtnEl.classList.add('hide');
   });
}

formEl.addEventListener('submit', e => getFirstResults(e));

loadMoreBtn.addEventListener('click', getNextPage);
