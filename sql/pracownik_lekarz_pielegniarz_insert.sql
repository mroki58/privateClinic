set search_path to proj;

-- widok bedzie sluzyl do wstawiania nowego lekarza
-- wykorzystamy trigger instead of
create view lekarz_widok as select p.*, l.specjalizacja, l.oddzial_id from pracownik p 
join lekarz l on p.pracownik_id = l.lekarz_id; 

-- widok bedzie sluzyl do wstawiania nowego pielegniarza
-- wykorzystamy trigger instead of
create view pielegniarz_widok as select p.*, l.oddzial_id from pracownik p 
join pielegniarz l on p.pracownik_id = l.pielegniarz_id;

--funkcja do dodawania pracownika
-- dodajemy dane do powiazanej tabeli
create or replace function dodaj_pracownika()
returns trigger as $$
DECLARE
	id INT;
BEGIN

	 	IF TG_RELNAME = 'lekarz_widok' THEN
			INSERT INTO pracownik values (NEW.imie, 
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
										NEW.specjalizacja,
										NEW.oddzial_id);
		ELSE 
			INSERT INTO pracownik values (NEW.imie, 
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

create trigger dodanie_lekarza instead of insert on lekarz_widok
for each row execute procedure dodaj_pracownika();

create trigger dodanie_pielegniarza instead of insert on pielegniarz_widok
for each row execute procedure dodaj_pracownika();
	


