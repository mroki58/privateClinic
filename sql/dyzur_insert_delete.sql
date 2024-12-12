-- Tutaj będzie dodawanie elementu tabeli dyżur oraz pracownik_dyżur
-- Również dla wygody 
-- Będzie też można usunąć kogoś z tabeli
set search_path to proj;

select * from dyzur;

set datestyle to european;

insert into dyzur(data, zmiana) values ('20-01-2025', 'R');
insert into dyzur(data, zmiana) values ('20-01-2025', 'D');

insert into pracownik_dyzur values (1,2), (1,4);
select * from dyzur join pracownik_dyzur using(dyzur_id);



-- nie chcemy aby jedna osoba miala dwa dyzury jednego dnia
create or replace function sprawdz_czy_dzisiaj_zajety()
returns trigger as $$
BEGIN

	IF EXISTS (SELECT 1 FROM dyzur d 
					JOIN pracownik_dyzur pd  USING(dyzur_id) 
						WHERE pd.pracownik_id = NEW.pracownik_id 
							AND d.data = (SELECT data FROM dyzur d1
									where d1.dyzur_id = NEW.dyzur_id)
						) THEN
		RAISE EXCEPTION 'Pracownik ma juz dyzur tego dnia';
		RETURN NULL;
	END IF;
	RETURN NEW;
END
$$ language plpgsql;

create trigger sprawdzenie_czy_jest_dyzur before insert 
on pracownik_dyzur for each row 
execute function sprawdz_czy_dzisiaj_zajety();

insert into pracownik_dyzur values (2,2);
insert into pracownik_dyzur values (2,3);
select * from pracownik_dyzur;


-- wybieramy dyzur na ktorym chcemy zmienic pracownika
-- musimy sprawdzic czy pracownicy sa z tego samego oddzialu w innym przypadku mamy wyjatek
-- musimy sprawdzic czy typ pracownika sie zgadza
create or REPLACE FUNCTION zmiana_pracownika()
returns trigger as $$
DECLARE
	_oddzial_zmiennika INT; 
	_data date;
BEGIN

	-- jezeli ktos jest lekarzem - zamienimy go tylko na lekarza
	IF EXISTS (SELECT 1 FROM lekarz WHERE lekarz_id = OLD.pracownik_id) THEN
		IF NOT EXISTS (SELECT 1 FROM lekarz WHERE lekarz_id = NEW.pracownik_id) THEN
			RAISE EXCEPTION 'Zmiana na powiodla sie - nie mozna zamienic lekarza i pieleniarza';
			RETURN NULL;
		END IF;

		SELECT INTO _oddzial_zmiennika oddzial_id FROM lekarz WHERE lekarz_id = NEW.pracownik_id;
			IF _oddzial_zmiennika <> (SELECT oddzial_id FROM lekarz WHERE lekarz_id = OLD.pracownik_id) THEN
				RAISE EXCEPTION 'Zmiana nie powiodla sie - niezgodnosc oddzialow';
				RETURN NULL;
			END IF;




	ELSE -- jezeli ktos nie jest lekarzem

		IF NOT EXISTS (SELECT 1 FROM pielegniarz WHERE pielegniarz_id = NEW.pracownik_id) THEN
			RAISE EXCEPTION 'Zmiana na powiodla sie - nie mozna zamienic lekarza i pieleniarza';
			RETURN NULL;
		END IF;

		SELECT INTO _oddzial_zmiennika oddzial_id FROM pielegniarz WHERE pielegniarz_id = NEW.pracownik_id;
			IF _oddzial_zmiennika <> (SELECT oddzial_id FROM lekarz WHERE lekarz_id = OLD.pracownik_id) THEN
				RAISE EXCEPTION 'Zmiana nie powiodla sie - niezgodnosc oddzialow';
				RETURN NULL;
			END IF;

	END IF;
	

	IF EXISTS (SELECT lekarz_id from lekarz WHERE lekarz_id = OLD.pracownik_id) THEN -- jezeli zmiana dotyczy lekarza musimy zmienic lekarza w wizytach
		SELECT INTO _data data FROM dyzur WHERE dyzur_id = OLD.dyzur_id;
		UPDATE wizyta SET lekarz_id = NEW.pracownik_id WHERE lekarz_id = OLD.pracownik_id AND data = _data;
	END IF; 
	RETURN NEW;
END;
$$ language plpgsql;


create trigger zmiana_pracownika after update
on pracownik_dyzur for each row
execute procedure zmiana_pracownika();

update pracownik_dyzur set pracownik_id = 2 where dyzur_id = 1 and pracownik_id = 7; 
-- update pracownik_dyzur set pracownik_id = 5 where dyzur_id = 1 and pracownik_id = 2; nie powiodlo sie


select * from dyzur;
select * from pracownik_dyzur;


-- usuniecie wizyty jesli została już dodana jesli usuniemy pracownika z dyzuru
-- nie usuwamy dyzurow, po stworzeniu ich
create or replace function usun_wizyty()
returns trigger as $$
DECLARE 
	_data DATE;
BEGIN
	IF EXISTS (SELECT lekarz_id from lekarz WHERE lekarz_id = OLD.pracownik_id) THEN -- jezeli zmiana dotyczy lekarza musimy zmienic lekarza w wizytach
		SELECT data INTO _data FROM dyzur WHERE dyzur_id = OLD.dyzur_id;  
		DELETE FROM wizyta WHERE lekarz_id = OLD.pracownik_id AND data = _data;
	END IF;
	RETURN OLD;
END;
$$ language plpgsql;


CREATE TRIGGER usuniecie_wizyty 
BEFORE DELETE ON pracownik_dyzur FOR EACH ROW
EXECUTE FUNCTION usun_wizyty();








