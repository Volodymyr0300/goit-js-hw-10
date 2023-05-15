import './css/styles.css';
import fetchCountriesFromBeckend from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBoxRef = document.querySelector('#search-box');
console.log('🚀 ~ file: index.js:9 ~ searchBoxRef:', searchBoxRef);
const countriesListRef = document.querySelector('.country-list');
console.log('🚀 ~ file: index.js:11 ~ countriesListRef:', countriesListRef);
const countryInfoRef = document.querySelector('.country-info');
console.log('🚀 ~ file: index.js:13 ~ countryInfoRef:', countryInfoRef);

searchBoxRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const formSearch = e.target.value.trim();

  if (formSearch) {
    fetchCountriesFromBeckend
      .fetchCountries(formSearch)
      .then(successInput)
      .catch(errorRender);
  }

  clearInput(formSearch);
}

function renderSingleCountry(result) {
  if (result.length === 1) {
    countriesListRef.innerHTML = renderCountryList(result);
    countryInfoRef.innerHTML = renderCountryInfo(result);
  }
}

function renderSeveralCountry(result) {
  if (result.length >= 2 && result.length <= 10) {
    countryInfoRef.innerHTML = '';
    countriesListRef.innerHTML = renderCountryList(result);
  }
}

function renderMultiduteCountry(result) {
  if (result.length >= 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}

function errorRender() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearInput(formSearch) {
  if (formSearch === '') {
    countriesListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
  }
}

function renderCountryList(e) {
  return e.map(el => {
    return `
    <li class="country-item">
    <img src="${el.flags.svg}" width="30" height="20">
    <b class="country-name">${el.name.official}</b>
    </li>
    `;
  });
}

function renderCountryInfo(e) {
  return e
    .map(el => {
      const language = Object.values(el.languages).join(', ');
      return `
    <ul class="country-info-head">
    <li><p class="country-info-text">Capital: <span class="country-info-span">${el.capital}</span></p></li>
    <li><p class="country-info-text">Population: <span class="country-info-span">${el.population}</span></p></li>
    <li><p class="country-info-text">Languages: <span class="country-info-span">${language}</span></p></li>
    </ul>
    `;
    })
    .join('');
}

function successInput(result) {
  renderSingleCountry(result);
  renderSeveralCountry(result);
  renderMultiduteCountry(result);
}
