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

    fetch('/api/wizyta/rodzaj')
    .then(res => res.json())
    .then(res => {

        console.log(res)

        let rw_select = document.querySelector(` #${form_id} > #rodzaj_wizyty_id`)
        let options = ''

        for(let el of res)
        {
            options += `<option value="${el.rodzaj_wizyty_id}"> ${el.opis} </option>`
        }

        rw_select.innerHTML = options
        
    })
}

// przyda sie jeszcze
async function getPacjent(event, url) {
    event.preventDefault(); // Zatrzymuje przeładowanie strony

    dataArea.innerHTML = '';

    let pacjent_form = document.getElementById('findPacjent');

    url += `?nazwisko=${pacjent_form.nazwisko.value}`

    try {
        const response = await fetch(url);

        const result = await response.json();
        
        if (response.ok) {
            let table = '<table> <thead> <tr> <th> pacjent_id </th> <th> imie </th> <th> nazwisko </th> <th> nr_telefonu </th>  <th> ulica </th> </tr> </thead> <tbody>';
            for(let pacjent of result)
            {
                table += '<tr>'
                for(const key in pacjent)
                {
                    table += `<td> ${pacjent[key]} </td>`
                }
                
                table += '</tr>'
            }

            dataArea.innerHTML = table;


        } else {
            alert(result.error || 'Wystąpił błąd.');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
        alert('Wystąpił błąd sieci.');
    }
}

async function getLekarz(event, url)
{
    event.preventDefault()

    form.style.display = 'none';
    dataArea.innerHTML = ''

    getLekarzForWizyta()
        .then(res => {
            ans = '<list>'
            for(let el of res)
            {
                for(const key in el)
                {
                    if(key !== 'rodzaj_wizyty_id')
                    ans += `<li> ${el[key]} </li>`
                }
                ans += '<hr>'
            }
            ans += '</list>'
            dataArea.innerHTML = ans;
        })

} 

async function getWizyty(event, url)
{
    event.preventDefault(); 

    dataArea.innerHTML = '';

    let wizyta_form = document.getElementById('findWizytyForLekarz');

    url += `?data=${wizyta_form.data.value}&nazwisko=${wizyta_form.nazwisko.value}`

    try {
        const response = await fetch(url);

        const result = await response.json();

        if (response.ok) {
            let table = '<table> <thead> <tr> <th> wizyta </th> <th> godzina </th> <th> lekarz_id </th>  <th> nazwisko </th> </tr> </thead> <tbody>';
            for (let el of result) {
                table += '<tr>'
                for (const key in el) {
                    if(key === 'data')
                    {
                        continue;
                    }else{
                        table += `<td> ${el[key]} </td>`
                    }
                }

                table += '</tr>'
            }

            dataArea.innerHTML = table;


        } else {
            alert(result.error || 'Wystąpił błąd.');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
        alert('Wystąpił błąd sieci.');
    }


}

async function findDyzury(event, url, form_id)
{
    event.preventDefault()

    dataArea.innerHTML = '';

    let dyzur_form = document.getElementById(form_id);

    url += `?data=${dyzur_form.data.value}`

    try {
        const response = await fetch(url);

        const result = await response.json();

        if (response.ok) {
            let table = '<table> <thead> <tr> <th> pracownik_id </th> <th> imie </th> <th> nazwisko </th>  <th> zmiana</th>   <th> oddział </th></tr> </thead> <tbody>';
            for (let el of result) {
                table += '<tr>'
                for (const key in el) {
                    if (key === 'data') {
                        continue;
                    } else {
                        table += `<td> ${el[key]} </td>`
                    }
                }

                table += '</tr>'
            }

            dataArea.innerHTML = table;


        } else {
            alert(result.error || 'Wystąpił błąd.');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
        alert('Wystąpił błąd sieci.');
    }

}

async function findStatsForLekarz(event, url, form_id)
{
    event.preventDefault();

    const input = document.querySelector(` #${form_id} > #monthYear`);

    const [year, month] = input.value.split('-');

    url += `?rok=${year}&miesiac=${month}`

    try {
        const response = await fetch(url);

        const result = await response.json();

        console.log(result)
        if (response.ok) {
            let table = '<table> <thead> <tr> <th> rank </th> <th> imie </th> <th> nazwisko </th> <th> oddział </th> <th> ilosc_wizyt </th> </tr> </thead> <tbody>';
            for (let el of result) {
                table += '<tr>'
                for (const key in el) {
                    if (key === 'data') {
                        continue;
                    } else {
                        table += `<td> ${el[key]} </td>`
                    }
                }

                table += '</tr>'
            }

            dataArea.innerHTML = table;


        } else {
            alert(result.error || 'Wystąpił błąd.');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
        alert('Wystąpił błąd sieci.');
    }  
}

async function findStatsForOddzial(event, url, form_id)
{
    event.preventDefault();

    const input = document.querySelector(` #${form_id} > #oddzial_id`);
    console.log(input.value)
    url += `?oddzial_id=${input.value}`

    try {
        const response = await fetch(url);

        const result = await response.json();

        console.log(result)
        if (response.ok) {
            let table = '<table> <thead> <tr> <th> rok </th> <th> miesiąc </th> <th> suma </th>  </tr> </thead> <tbody>';
            for (let el of result) {
                table += '<tr>'
                for (const key in el) {
                    if (key === 'data') {
                        continue;
                    } else {
                        if(el[key] != null)    
                            table += `<td> ${el[key]} </td>`
                        else 
                            table += '<td></td>'
                    }
                }

                table += '</tr>'
            }

            dataArea.innerHTML = table;


        } else {
            alert(result.error || 'Wystąpił błąd.');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
        alert('Wystąpił błąd sieci.');
    }
}