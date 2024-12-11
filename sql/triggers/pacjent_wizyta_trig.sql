-- dopisuje doktora do spotkania
-- sprawdza czy spotkanie mozna wogole stworzyc
-- zakladamy, ze musi byc juz ustalony grafik
-- musimy tez sprawdzic czy data, czas oraz lekarz już nie są zajęte 
-- zakladamy, ze czas dla zmiany rannej 7:00 - 15:00 a dla zmiany popoludniowej(dziennej) 15:00 - 23:00
create or replace function sprawdz_czy_ma_dyzur()
returns trigger as $$
BEGIN
	SELECT l.lekarz_id INTO NEW.lekarz_id
    			FROM lekarz l
		    WHERE oddzial_id = ( -- oddzial zgadza sie z rodzajem wizyty
		        SELECT oddzial_id
		        	FROM rodzaj_wizyty
		        WHERE rodzaj_wizyty_id = NEW.rodzaj_wizyty_id
		    )
		    AND l.lekarz_id NOT IN ( -- lekarz nie ma wizyty o tej godzinie
		        SELECT lekarz_id
		        FROM wizyta
		        WHERE data = NEW.data
		          AND godzina = NEW.godzina
		    )
		    AND EXISTS( -- czy lekarz wogole ma dyzur tego dnia i czy jest na odpowiedniej zmianie
		        SELECT 1
		        FROM dyzur d JOIN pracownik_dyzur pd USING(dyzur_id)
		        WHERE pracownik_id = l.lekarz_id
		          AND data = NEW.data
				  AND (CASE WHEN d.zmiana = 'D' AND NEW.godzina >= '15:00' THEN true
							 WHEN d.zmiana = 'R' AND NEW.godzina < '15:00' THEN true
							 ELSE false END)
		    )
		    LIMIT 1;

	-- jesli nie mozna dodac zadnego lekarza do wizyty to zglaszamy wyjatek
    IF NEW.lekarz_id IS NULL THEN
        RAISE EXCEPTION 'Brak dostępnego lekarza dla podanego rodzaju wizyty';
		RETURN NULL;
    END IF;

	RETURN NEW;
END;
$$ language plpgsql;


CREATE TRIGGER sprawdz_przed_wizyta 
BEFORE INSERT ON wizyta FOR EACH ROW
EXECUTE FUNCTION sprawdz_czy_ma_dyzur();


