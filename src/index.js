import './css/styles.css';
import fetchCountries from './fetchCountries';
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

function onSearch() {
  const countryName = searchBoxRef.value.trim();

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length >= 2 && countries.length <= 10) {
        addMarkupCounntryList(countries);
      } else if (countries.length === 1) {
        addMarkupCounntryList(countries);
      } else if (countries.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearContent();
    });
}

function addMarkupCounntryList(countries) {
  clearContent();
  const markupCountriesList = countries
    .map(({ name: { official }, flags, capital, population, languages }) => {
      const language = Object.values(languages).join(', ');
      return `<div class="country-info-head">
      <img class="country-info-flag" src="${flags[0]}" alt="flag of country" width="100">
      <h2 class="country-info-title">${official}</h2>
      <p class="country-info-capital"><strong>Capital: </strong>${capital}</p>
      <p class="country-info-population"><strong>Population: </strong>${population}</p>
      <p class="country-info-languages"><strong>Languages: </strong>${language}</p>
      </div>`;
    })
    .join('');

  return (countryInfoRef.innerHTML = markupCountriesList);
}

function clearContent() {
  countriesListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}
