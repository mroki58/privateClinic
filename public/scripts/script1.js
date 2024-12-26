let formArea = document.getElementById("formArea")
let dataArea = document.getElementById("formArea")

let form = document.getElementById("formLekarz"); // default

// wyswietla formularz usuwa poprzedni
// jesli oddzialy sa potrzebne w nowym formularzu drugi argument musi byc true
function showForm(form_id, oddzialy = false)
{
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


