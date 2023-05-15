import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const countryName = event.target.value.trim();

  if (!countryName) {
    clearingMarkup();
    return;
  }

  fetchCountries(countryName)
    .then(resalt => {
      if (resalt.length > 10) {
        moreSpecificName();
        clearingMarkup();
        return;
      }
      renderMarkup(resalt);
    })
    .catch(error => {
      clearingMarkup();
      onError();
    });
}

function renderMarkup(elements) {
  let markup = '';
  let refsMarkup = '';
  clearingMarkup();

  if (elements.length === 1) {
    markup = createMarkupItem(elements);
    refsMarkup = refs.countryInfo;
  } else {
    markup = createMarkupItemList(elements);
    refsMarkup = refs.countryList;
  }

  creationMarkup(refsMarkup, markup);
}

function createMarkupItem(country) {
  return country
    .map(
      ({ name, capital, population, flags, languages }) =>
        `
        <div class="country-info-wrap">
          <img
            src='${flags.svg}' 
            alt='${name.official}' 
            width="60">
          <h2 class='country-info-title'>${name.official}</h2>
        </div>
          <p class='country-info-text'><b>Capital:</b> ${capital}</p>
          <p class='country-info-text'><b>Population:</b> ${population}</p>
          <p class='country-info-text'><b>Languages:</b> ${Object.values(
            languages
          )}</p>
        `
    )
    .join('');
}

function createMarkupItemList(countries) {
  return countries
    .map(
      ({ name, flags }) =>
        ` <li class='country-list-item'>
            <img
              src='${flags.svg}' 
              alt='${name.official}' 
              width="40">
            <h2 class='country-list-title'>${name.common}</h2>
          </li>  
        `
    )
    .join('');
}

function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function moreSpecificName() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function clearingMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function creationMarkup(refsEl, markup) {
  refsEl.innerHTML = markup;
}
