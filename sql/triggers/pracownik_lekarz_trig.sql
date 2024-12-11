set search_path to proj;

-- widok bedzie sluzyl do wstawiania nowego lekarza
-- wykorzystamy trigger instead of
create view lekarz_insert_widok as select p.*, l.oddzial_id from pracownik p 
join lekarz l on p.pracownik_id = l.lekarz_id; 

-- widok bedzie sluzyl do wstawiania nowego pielegniarza
-- wykorzystamy trigger instead of
create view pielegniarz_insert_widok as select p.*, l.oddzial_id from pracownik p 
join pielegniarz l on p.pracownik_id = l.pielegniarz_id;

--funkcja do dodawania pracownika
-- dodajemy dane do powiazanej tabeli
create or replace function dodaj_pracownika()
returns trigger as $$
DECLARE
	id INT;
BEGIN

	 	IF TG_RELNAME = 'lekarz_insert_widok' THEN
			INSERT INTO pracownik(imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu) values (NEW.imie, 
											NEW.nazwisko, 
											NEW.plec, 
											NEW.pesel, 
											NEW.miejscowosc,
											NEW.ulica,
											NEW.nr_domu,
											NEW.nr_lokalu,
											NEW.pensja,
											NEW.wyksztalcenie,
											NEW.nr_telefonu)
			RETURNING pracownik_id INTO id;
			INSERT INTO lekarz values(id,	
										NEW.oddzial_id);
		ELSE 
			INSERT INTO pracownik(imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu) values (NEW.imie, 
											NEW.nazwisko, 
											NEW.plec, 
											NEW.pesel, 
											NEW.miejscowosc,
											NEW.ulica,
											NEW.nr_domu,
											NEW.nr_lokalu,
											NEW.pensja,
											NEW.wyksztalcenie,
											NEW.nr_telefonu)
			RETURNING pracownik_id INTO id;
			INSERT INTO pielegniarz values(id,	
										NEW.oddzial_id);
		END IF;

		RETURN NEW;
END
$$ language plpgsql;

--- dodanie triggerow INSTEAD OF do wstawiania danych dla pracownikow
create trigger dodanie_lekarza instead of insert on lekarz_insert_widok
for each row execute procedure dodaj_pracownika();

create trigger dodanie_pielegniarza instead of insert on pielegniarz_insert_widok
for each row execute procedure dodaj_pracownika();


--- Funkcja ktora wykorzystam do triggera aby nie mozna bylo ustalic pracownika spoza
--- oddzialu ordynatorem lub oddzialowym
create or replace function sprawdzenie_pracownika()
returns trigger as $$
DECLARE 
	rec RECORD;
BEGIN
	
	IF OLD.ordynator <> NEW.ordynator THEN
		SELECT * INTO rec FROM lekarz WHERE lekarz_id = NEW.ordynator;
		IF NOT EXISTS(SELECT 1 FROM lekarz WHERE oddzial_id = OLD.oddzial_id AND lekarz_id = NEW.ordynator) THEN
			RAISE EXCEPTION 'Zly oddzial';
			RETURN NULL; 
		END IF;
	END IF;

	
	IF OLD.oddzialowy <> NEW.oddzialowy THEN
		SELECT * INTO rec FROM pielegniarz WHERE pielegniarz_id = NEW.oddzialowy;
		IF NOT EXISTS(SELECT 1 FROM pielegniarz WHERE oddzial_id = OLD.oddzial_id AND pielegniarz_id = NEW.oddzialowy) THEN
			RAISE EXCEPTION 'Zly oddzial';
			RETURN NULL;
		END IF;
	END IF;

	RETURN NEW;
END
$$ language plpgsql;

-- trigger przed update na oddzial
create trigger zmiana_nadzorcy before update on oddzial 
for each row execute procedure sprawdzenie_pracownika();
