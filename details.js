const countryDetailsContainer = document.getElementById('country-details');
const urlParams = new URLSearchParams(window.location.search);
const countryCode = urlParams.get('code');

// Функция для отображения детальной информации о стране
function renderCountryDetails(country) {
    countryDetailsContainer.innerHTML = `
        <img src="${country.flags?.png || 'placeholder.png'}" alt="Flag of ${country.name.common}">
        <h1>${country.name.common}</h1>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Capital:</strong> ${country.capital || 'No capital'}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
        <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
        <p><strong>Currencies:</strong> ${Object.values(country.currencies || {})
            .map(currency => `${currency.name} (${currency.symbol})`)
            .join(', ')}</p>
    `;
}

// Запрос к API для получения данных о стране
fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    .then(response => response.json())
    .then(data => renderCountryDetails(data[0]))
    .catch(error => {
        countryDetailsContainer.innerHTML = `<p>Error loading country data: ${error.message}</p>`;
    });
