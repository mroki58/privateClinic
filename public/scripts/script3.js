function showFormForZamiana(form_id) 
{
    showForm(form_id);

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
            oddzial_select.innerHTML = options

        })

    oddzial_select.addEventListener('change', () => {
        let pracownik_select1 = document.querySelector(`#${form_id} > #pracownik_id`)
        let pracownik_select2 = document.querySelector(`#${form_id} > #nowy_pracownik_id`)

        getPracownicy()
            .then(pracownicy => {
                let options = ''
                for (let pracownik of pracownicy) {
                    if (pracownik.oddzial === oddzial_select.value) {
                        options += `<option value="${pracownik.pracownik_id}"> ${pracownik.pracownik_id} ${pracownik.imie_nazwisko} - ${pracownik.typ} </option>`
                    }
                }
                pracownik_select1.innerHTML = options;
                pracownik_select2.innerHTML = options;
            });
    })
}

async function putPracownikOnDyzur(event, url, form_id)
{
    event.preventDefault();

    let form = document.getElementById(form_id);

    data = {
        "data": form.data.value,
        "zmiana_id": form.zmiana_id.value,
        "pracownik_id": form.pracownik_id.value,
        "nowy_pracownik_id": form.nowy_pracownik_id.value,
    }

    console.log(data)

    try {
        const response = await fetch(url, {
            method: 'PUT',
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

async function deletePracownikOnDyzur(event, url, form_id) {
    event.preventDefault();

    let form = document.getElementById(form_id);

    data = {
        "data": form.data.value,
        "zmiana_id": form.zmiana_id.value,
        "pracownik_id": form.pracownik_id.value,
    }

    console.log(data)

    try {
        const response = await fetch(url, {
            method: 'DELETE',
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

function showFormForChief(form_id) {
    showForm(form_id);

    let oddzial_select = document.querySelector(` #${form_id} > #oddzial_id `)
    fetch("/api/oddzial")
        .then(res => res.json())
        .then(res => {
            let options = '<option>---</option>'
            for (let el of res) {
                let value = el.oddzial_id;
                let name = el.nazwa;
                console.log(el);
                options += `<option value="${value}"> ${name} </option>`;
            }
            oddzial_select.innerHTML = options
        })

    oddzial_select.addEventListener('change', () => {
        let pracownik_select1 = document.querySelector(`#${form_id} > #pracownik_id`)
        getPracownicy()
            .then(pracownicy => {
                let options = ''
                for (let pracownik of pracownicy) {
                    if (pracownik.oddzial_id == oddzial_select.value) {
                        options += `<option value="${pracownik.pracownik_id}"> ${pracownik.pracownik_id} ${pracownik.imie_nazwisko} - ${pracownik.typ} </option>`
                    }
                }
                pracownik_select1.innerHTML = options;
            });
    })
}

async function putChief(event, url, form_id)
{
    event.preventDefault();

    let form = document.getElementById(form_id);

    data = {
        "oddzial_id": form.oddzial_id.value,
        "pracownik_id": form.pracownik_id.value,
    }

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.error || 'Dane zmienione pomyślnie!');
        } else {
            alert(result.error || 'Wystąpił błąd.');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
        alert('Wystąpił błąd sieci.');
    }

}




