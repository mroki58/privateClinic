let formArea = document.getElementById("formArea")
let dataArea = document.getElementById("dataArea")

let form = document.getElementById("formLekarz"); // default

// wyswietla formularz usuwa poprzedni
// jesli oddzialy sa potrzebne w nowym formularzu drugi argument musi byc true
function showForm(form_id, oddzialy = false, specjalizacje = false)
{
    dataArea.innerHTML = '';
    // usuwa poprzedni formularz i wstawia nowy

    form.style.display = 'none';
    form = document.getElementById(form_id);
    form.style.display = "block";

    if(oddzialy)
    {
        let oddzial_select = document.querySelector(` #${form_id} > #oddzial_id `)
        fetch("/api/oddzial")
        .then(res => res.json())
        .then(res => {
            let options = '' 
            for(let el of res)
            {
                let value = el.oddzial_id;
                let name = el.nazwa;
                console.log(el);
                options += `<option value="${value}"> ${name} </option>`;
            }
            oddzial_select.innerHTML = options
            
        })
    }

    if(specjalizacje)
    {
        let spec_select = document.querySelector(`#${form_id} > #specjalizacja_id `)
        fetch("/api/lekarz/spec")
        .then(res => res.json())
        .then(res => {
            let options = ''
            for (let el of res) {
                let value = el.specjalizacja_id;
                let name = el.opis;
                console.log(el);
                options += `<option value="${value}"> ${name} </option>`;
            }
            spec_select.innerHTML = options
        })
    }
}

// powinno dzialac dla kazdego forma
async function submitForm(event, url)
{
    event.preventDefault(); // Zatrzymuje przeładowanie strony

    const formData = new FormData(form);

    // Konwertowanie formData na obiekt JSON
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log(data);
        const result = await response.json();
        if (response.ok) {
            alert(result.error || 'Dane dodane pomyślnie!');
        } else {
            alert(result.error || 'Wystąpił błąd.');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
        alert('Wystąpił błąd sieci.');
    }
}




async function getPracownicy() {
    return fetch('/api/pracownicy')
        .then(res => res.json());
}

// dyzur musi zwracac wszystko z dyzuru
async function getDyzury() {
    return fetch('/api/dyzur')
        .then(res => res.json())
}

async function getOddzialy(){
    return fetch('/api/oddzial')
        .then(res => res.json())
}

async function getLekarzForWizyta(){
    return fetch('/api/wizyta')
        .then(res => res.json())
}


function showFormForDyzur(form_id)
{
    dataArea.innerHTML = ''

    form.style.display = 'none';
    form = document.getElementById(form_id);
    form.style.display = "block";


    let oddzial_select = document.querySelector(` #${form_id} > #oddzial_id `)
    fetch("/api/oddzial")
        .then(res => res.json())
        .then(res => {
            let options = '<option>---</option>'
            for (let el of res) {
                let value = el.oddzial_id;
                let name = el.nazwa;
                console.log(el);
                options += `<option value="${name}"> ${name} </option>`;
            }
            options += `<option value="Inne"> Inne </option>"`
            oddzial_select.innerHTML = options

        })


    let table = '<table> <thead> <tr> <th> dyzur_id </th> <th> data </th> <th> zmiana </th> </tr> </thead>   <tbody>';
    getDyzury()
    .then(dyzury => {
        for(let dyzur of dyzury)
        {
            console.log(dyzur);
            const data = new Date(dyzur.data.split('T')[0]); 
            data.setDate(data.getDate() + 1);
            table += `<tr><td> ${dyzur.dyzur_id}</td> <td>${data.toISOString().slice(0, 10)}</td> <td> ${dyzur.zmiana_id == 1 ? "Ranna": "Dzienna"}</td> </tr>`
        }
        table += '</tbody> </table>'

        dataArea.innerHTML = table;
    })


}


let oddzial_select = document.querySelector(`#formDyzurPracownik > #oddzial_id`)
oddzial_select.addEventListener('change', () => {
    let pracownik_select = document.querySelector(`#formDyzurPracownik > #pracownik_id`)
    getPracownicy()
        .then(pracownicy => {
            let options = ''
            for (let pracownik of pracownicy) {
                if (pracownik.oddzial === oddzial_select.value) {
                    options += `<option value="${pracownik.pracownik_id}"> ${pracownik.imie_nazwisko} - ${pracownik.typ} </option>`
                }
            }
            pracownik_select.innerHTML = options;
        });
})


async function submitFormForDyzur(event, url) {
    event.preventDefault(); 

    const pracownikId = document.getElementById('pracownik_id').value;
    const dyzurId = document.getElementById('dyzur_id').value;

    const data = {
        pracownik_id: pracownikId,
        dyzur_id: dyzurId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.error || 'Dane dodane pomyślnie!');
        } else {
            alert(result.error || 'Wystąpił błąd.');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
        alert('Wystąpił błąd sieci.');
    }
}



