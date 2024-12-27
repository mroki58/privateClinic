// tutaj beda dla potrzebne funkcje dla posta do zapisywania wizyty

function showFormForWizyta(form_id) {
    dataArea.innerHTML = '';
    // usuwa poprzedni formularz i wstawia nowy
    form.style.display = 'none';
    form = document.getElementById(form_id);
    form.style.display = "block";

    let godzina_select = document.querySelector(`#${form_id} > #godzina`)
    for (let godzina = 7; godzina < 23; godzina++) {
        for (let minuta = 0; minuta <= 30; minuta += 30) {
            const formatGodzina = godzina.toString().padStart(2, '0');
            const formatMinuta = minuta.toString().padStart(2, '0');
            const opcja = document.createElement('option');
            opcja.value = `${formatGodzina}:${formatMinuta}`;
            opcja.text = `${formatGodzina}:${formatMinuta}`;
            godzina_select.appendChild(opcja);
        }
    }
}

// przyda sie jeszcze
async function getPacjent(event, url) {
    event.preventDefault(); // Zatrzymuje przeładowanie strony

    let pacjent_form = document.getElementById('findPacjent');

    url += `?nazwisko=${pacjent_form.nazwisko.value}`

    try {
        const response = await fetch(url);

        const result = await response.json();
        
        if (response.ok) {
            let ans = ''
            for(let el of result)
            {
                ans += JSON.stringify(el) + '\n';
            }
            alert(ans);

        } else {
            alert(result.error || 'Wystąpił błąd.');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
        alert('Wystąpił błąd sieci.');
    }
}