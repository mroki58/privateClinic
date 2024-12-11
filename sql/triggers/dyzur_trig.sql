-- Tutaj będzie dodawanie elementu tabeli dyżur oraz pracownik_dyżur
-- Również dla wygody 
-- Będzie też można usunąć kogoś z tabeli
set search_path to proj;

-- wybieramy dyzur na ktorym chcemy zmienic pracownika
-- musimy sprawdzic czy pracownicy sa z tego samego oddzialu w innym przypadku mamy wyjatek
-- musimy sprawdzic czy typ pracownika sie zgadza
create or REPLACE FUNCTION zmiana_pracownika()
returns trigger as $$
DECLARE
	_oddzial_zmiennika INT; 
	_data DATE;
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
		SELECT INTO _data data FROM dyzur WHERE dyzur_id = OLD.dyzur_id ;
		UPDATE wizyta SET lekarz_id = NEW.pracownik_id WHERE lekarz_id = OLD.pracownik_id AND data = _data;
	END IF; 
	RETURN NEW;
END;
$$ language plpgsql;


create trigger zmiana_pracownika after update
on pracownik_dyzur for each row
execute procedure zmiana_pracownika();



-- usuniecie wizyty jesli została już dodana jesli usuniemy pracownika z dyzuru
-- nie usuwamy dyzurow, po stworzeniu ich
create or replace function usun_wizyty()
returns trigger as $$
DECLARE 
	_data DATE;
BEGIN
	IF EXISTS (SELECT lekarz_id from lekarz WHERE lekarz_id = OLD.pracownik_id) THEN -- jezeli zmiana dotyczy lekarza musimy zmienic lekarza w wizytach
		SELECT data INTO _data FROM dyzur WHERE dyzur_id = OLD.dyzur_id;  
		DELETE FROM wizyta WHERE lekarz_id = OLD.lekarz_id AND data = _data;
	END IF;
	RETURN OLD;
END;
$$ language plpgsql;


CREATE TRIGGER usuniecie_wizyty 
BEFORE DELETE ON pracownik_dyzur FOR EACH ROW
EXECUTE FUNCTION usun_wizyty();