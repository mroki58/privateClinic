---------------------------------------------------------------------------------------------------------
-- W tym pliku stworzone są widoki oraz triggery które są wykorzystywane do wstawiania danych do tabeli
-- pracownik / lekarz / pielegniarz
-- Ponadto dodajemy tutaj dane do powyzszych tabeli oraz do oddzial / rodzaj_wizyty
---------------------------------------------------------------------------------------------------------

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




-----------------
--- testy


INSERT INTO oddzial (nazwa, nr_budynku, ordynator, oddzialowy)
VALUES 
('Kardiologia', 1, NULL, NULL),
('Neurologia', 2, null, NULL),
('Pediatria', 3, null, NULL);

INSERT INTO lekarz_insert_widok (imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id)
VALUES 
('Jan', 'Kowalski', 'M', '85010112345', 'Kraków', 'Lipowa', '10', '1', 10000.00, 'wyzsze', '987654321', 1), 
('Tomasz', 'Zieliński', 'M', '87070123456', 'Kraków', 'Brzozowa', '22', '3', 11000.00, 'wyzsze', '987654322', 2), 
('Marta', 'Mazur', 'K', '90030134567', 'Kraków', 'Sosnowa', '5', 'A', 9500.00, 'wyzsze', '987654323', 3);

INSERT INTO pielegniarz_insert_widok (imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id)
VALUES 
('Anna', 'Nowak', 'K', '99120112345', 'Kraków', 'Różana', '12', '4', 4500.00, 'Licencjat ', '123456789', 3), 
('Katarzyna', 'Kowalska', 'K', '95010123456', 'Kraków', 'Tulipanowa', '8', NULL, 4700.00, 'Licencjat', '123456788', 2), 
('Ewa', 'Wiśniewska', 'K', '96050134567', 'Kraków', 'Malinowa', '15', '2', 4600.00, 'Licencjat', '123456787', 1);


update oddzial set ordynator = (select lekarz_id from lekarz where oddzial_id = 1) where oddzial_id = 1;
update oddzial set ordynator = (select lekarz_id from lekarz where oddzial_id = 2) where oddzial_id = 2;
update oddzial set ordynator = (select lekarz_id from lekarz where oddzial_id = 3) where oddzial_id = 3;

update oddzial set oddzialowy = (select pielegniarz_id from pielegniarz where oddzial_id = 1) where oddzial_id = 1;
update oddzial set oddzialowy = (select pielegniarz_id from pielegniarz where oddzial_id = 2) where oddzial_id = 2;
update oddzial set oddzialowy = (select pielegniarz_id from pielegniarz where oddzial_id = 3) where oddzial_id = 3;

insert into lekarz_insert_widok (imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id) values
('Tomasz', 'Jakubiak', 'M', '87070143451', 'Kraków', 'Rosłońskiego', '22', '3', 10000.00, 'wyzsze', '983614322', 2);

update oddzial set ordynator = 7 where oddzial_id = 2;

select * from pracownik;
select * from lekarz;
select * from pielegniarz;
select * from pracownik join lekarz on pracownik.pracownik_id = lekarz.lekarz_id;
select * from pracownik join pielegniarz on pracownik.pracownik_id = pielegniarz.pielegniarz_id;

select * from oddzial;

INSERT INTO rodzaj_wizyty (opis, cena, oddzial_id)
VALUES
('Echokardiografia', 300.00, (SELECT oddzial_id FROM oddzial WHERE nazwa = 'Kardiologia')),
('Konsultacja kardiologiczna', 200.00, (SELECT oddzial_id FROM oddzial WHERE nazwa = 'Kardiologia')),
('Test wysiłkowy', 350.00, (SELECT oddzial_id FROM oddzial WHERE nazwa = 'Kardiologia'));

INSERT INTO rodzaj_wizyty (opis, cena, oddzial_id)
VALUES
('Konsultacja neurologiczna', 250.00, (SELECT oddzial_id FROM oddzial WHERE nazwa = 'Neurologia')),
('Rezonans magnetyczny głowy', 600.00, (SELECT oddzial_id FROM oddzial WHERE nazwa = 'Neurologia')),
('Badanie EEG', 400.00, (SELECT oddzial_id FROM oddzial WHERE nazwa = 'Neurologia'));

-- Wizyty dla oddziału Pediatria
INSERT INTO rodzaj_wizyty (opis, cena, oddzial_id)
VALUES
('Konsultacja pediatryczna', 150.00, (SELECT oddzial_id FROM oddzial WHERE nazwa = 'Pediatria')),
('Szczepienie dziecięce', 100.00, (SELECT oddzial_id FROM oddzial WHERE nazwa = 'Pediatria')),
('Badanie bilansowe dziecka', 180.00, (SELECT oddzial_id FROM oddzial WHERE nazwa = 'Pediatria'));


	


