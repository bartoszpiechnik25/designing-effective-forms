let clickCount = 0;

const countryInput = document.getElementById('country');
const countryCodeSelect = document.getElementById('countryCode');
const myForm = document.getElementById('form');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const countries = data.map(c => c.name.common).sort();

        countryInput.innerHTML = countries
            .map(country => `<option value="${country}">${country}</option>`)
            .join('');
    } catch (err) {
        console.error('Błąd pobierania krajów:', err);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(res => res.json())
        .then(data => {
            const country = data.country;
            if (country) {
                countryInput.value = country;
                getCountryCode(country);
            }
        })
        .catch(err => {
            console.error('Błąd pobierania IP:', err);
        });
}

function getCountryCode(countryName) {
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then(res => res.json())
        .then(data => {
            const code = data[0].idd.root + data[0].idd.suffixes[0];
            if (code) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${code} (${countryName})`;
                countryCodeSelect.innerHTML = '';
                countryCodeSelect.appendChild(option);
            }
        })
        .catch(err => console.error('Nie można pobrać kodu kraju:', err));
}

// Dodanie wsparcia dla Entera i skrótów
myForm.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        myForm.requestSubmit();
    }
});

document.addEventListener('click', handleClick);

document.addEventListener('DOMContentLoaded', () => {
    fetchAndFillCountries();
    getCountryByIP();
});
