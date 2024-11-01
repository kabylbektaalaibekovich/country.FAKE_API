const flagtar = document.querySelector('.flagtar');
const input = document.querySelector('input');
const btn = document.querySelector('button');
const select = document.querySelector('select');
const loading = document.getElementById('loading');

let countryCache = [];

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function updateStatistics(countries) {
    const countryCount = countries.length;
    const totalPopulation = countries.reduce((acc, country) => acc + country.population, 0);

    document.getElementById('countryCount').textContent = `Total Countries: ${countryCount}`;
    document.getElementById('totalPopulation').textContent = `Total Population: ${totalPopulation.toLocaleString()}`;
}

function renderCountries(countries) {
    flagtar.innerHTML = '';
    countries.forEach(country => {
        const div = document.createElement('div');
        div.classList.add('box');
        
        const h1 = document.createElement('h1');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const h3 = document.createElement('h3');

        h1.textContent = country.name.common;
        img.src = country.flags?.png || 'placeholder.png';
        span.textContent = `Population: ${country.population}`;
        h3.textContent = country.capital ? `Capital: ${country.capital}` : 'No capital';

        div.addEventListener('click', () => {
            window.location.href = `details.html?code=${country.cca3}`;
        });

        flagtar.appendChild(div);
        div.append(img, h1, span, h3);
    });
    updateStatistics(countries);
}

function fetchCountries(sortType = 'Population') {
    showLoading();
    if (countryCache.length === 0) {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(countries => {
                countryCache = countries;
                sortAndRenderCountries(sortType, countries);
                hideLoading();
            })
            .catch(error => {
                flagtar.innerHTML = `<p>Error: ${error.message}</p>`;
                hideLoading();
            });
    } else {
        sortAndRenderCountries(sortType, countryCache);
        hideLoading();
    }
}

function sortAndRenderCountries(sortType, countries) {
    if (sortType === 'Population') {
        countries.sort((a, b) => a.population - b.population);
    } else if (sortType === 'Regions') {
        countries.sort((a, b) => a.region.localeCompare(b.region));
    } else if (sortType === 'A - Z') {
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    }
    renderCountries(countries);
}

select.addEventListener('change', (event) => {
    const value = event.target.value;
    fetchCountries(value);
});

function searchCountry() {
    flagtar.innerHTML = '';
    const query = input.value.toLowerCase().trim();
    if (!query) return;

    const results = countryCache.filter(country => 
        country.name.common.toLowerCase().includes(query)
    );

    if (results.length > 0) {
        renderCountries(results);
    } else {
        flagtar.innerHTML = '<p>No countries found</p>';
    }
}

btn.addEventListener('click', searchCountry);
fetchCountries();
