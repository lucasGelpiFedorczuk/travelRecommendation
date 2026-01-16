// Función para obtener los datos de la API local
function searchCondition() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const resultDiv = document.getElementById('resultContainer');
    resultDiv.innerHTML = ''; 

    // Mapa de zonas horarias para las ciudades del JSON
    const timeZones = {
        "Sydney, Australia": "Australia/Sydney",
        "Melbourne, Australia": "Australia/Melbourne",
        "Tokyo, Japan": "Asia/Tokyo",
        "Kyoto, Japan": "Asia/Tokyo",
        "Rio de Janeiro, Brazil": "America/Sao_Paulo",
        "São Paulo, Brazil": "America/Sao_Paulo"
    };

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let results = [];

            if (input.includes('beach') || input.includes('playa')) {
                results = data.beaches;
            } else if (input.includes('temple') || input.includes('templo')) {
                results = data.temples;
            } else {
                const country = data.countries.find(c => c.name.toLowerCase().includes(input));
                if (country) results = country.cities;
            }

            if (results.length > 0) {
                results.forEach(place => {
                    // Lógica de la Tarea 10: Obtener hora local
                    let localTimeStr = "";
                    const tz = timeZones[place.name];
                    
                    if (tz) {
                        const options = { 
                            timeZone: tz, 
                            hour12: true, 
                            hour: 'numeric', 
                            minute: 'numeric', 
                            second: 'numeric' 
                        };
                        localTimeStr = new Date().toLocaleTimeString('en-US', options);
                    }

                    const card = document.createElement('div');
                    card.className = 'result-card';
                    card.innerHTML = `
                        <img src="${place.imageUrl}" alt="${place.name}">
                        <div class="card-body">
                            <h3>${place.name}</h3>
                            ${localTimeStr ? `<p class="local-time"><strong>Local Time:</strong> ${localTimeStr}</p>` : ''}
                            <p>${place.description}</p>
                            <button class="btn-visit">Visit</button>
                        </div>
                    `;
                    resultDiv.appendChild(card);
                });
            } else {
                resultDiv.innerHTML = '<p class="error-msg">Please enter a valid search query.</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para el botón Clear (Restablecer)
document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('resultContainer').innerHTML = '';
});

document.getElementById('btnSearch').addEventListener('click', searchCondition);