set search_path to proj;
set datestyle to european;

-- funkcja zwraca pacjentow dla poczatku nazwiska
CREATE OR REPLACE FUNCTION api_get_pacjenci(TEXT)
RETURNS TABLE(pacjent_id INT, imie TEXT, nazwisko TEXT, nr_telefonu VARCHAR(12), ulica TEXT) AS
$$
BEGIN
    RETURN QUERY
    SELECT p.pacjent_id, p.imie, p.nazwisko, p.nr_telefonu, p.ulica
    FROM proj.pacjent p
    WHERE p.nazwisko ILIKE $1 || '%' ;
END;
$$ LANGUAGE plpgsql;

select * from api_get_pacjenci('Ko');


-- lekarze dla poczatku nazwy oddzialu
create or replace function api_get_lekarz(TEXT)
RETURNS TABLE(pracownik_id INT, imie TEXT, nazwisko TEXT, nr_telefonu VARCHAR(12), oddzial_id INT, oddzial TEXT) as
$$
begin
return query
	select p.pracownik_id, p.imie, p.nazwisko, p.nr_telefonu, o.oddzial_id, o.nazwa as oddzial 
		from proj.pracownik p
			join proj.lekarz l on p.pracownik_id = l.lekarz_id
			join proj.oddzial o USING(oddzial_id)
		where o.nazwa ilike $1 || '%';
end;
$$ language plpgsql;

select * from api_get_lekarz('Neu');

-- pielegniarze dla poczatku nazwy oddzialu
create or replace function api_get_pielegniarz(TEXT)
RETURNS TABLE(pracownik_id INT, imie TEXT, nazwisko TEXT, nr_telefonu VARCHAR(12), oddzial_id INT, oddzial TEXT) as
$$
begin
return query
	select p.pracownik_id, p.imie, p.nazwisko, p.nr_telefonu, o.oddzial_id, o.nazwa as oddzial 
		from proj.pracownik p
			join proj.pielegniarz l on p.pracownik_id = l.pielegniarz_id
			join proj.oddzial o USING(oddzial_id)
		where o.nazwa ilike $1 || '%';
end;
$$ language plpgsql;

select * from api_get_pielegniarz('pe');

-- zwraca dyzury dla lekarza z danego dnia
create or replace function api_dyzury_lekarze(DATE)
RETURNS TABLE(pracownik_id INT, imie TEXT, nazwisko TEXT,data DATE , zmiana text, oddzial TEXT) as
$$
BEGIN
return query
select p.pracownik_id ,p.imie, p.nazwisko, d.data, (case when d.zmiana = 'R' then 'ranna 7:00 - 15:00' else 'dzienna 15:00 - 23:00' END), o.nazwa as oddzial 
										from proj.pracownik p 
											join proj.lekarz l on p.pracownik_id = l.lekarz_id
											join proj.oddzial o USING(oddzial_id)
											join proj.pracownik_dyzur pd USING(pracownik_id) 
											join proj.dyzur d using(dyzur_id) 
										where d.data = $1;
END;
$$ language plpgsql;


select * from api_dyzury_lekarze('20-01-2025');


-- zwraca dyzury dla pielegniarzy z danego dnia
create or replace function api_dyzury_pieleg(DATE)
RETURNS TABLE(pracownik_id INT, imie TEXT, nazwisko TEXT,data DATE , zmiana text, oddzial TEXT) as
$$
BEGIN
return query
select p.pracownik_id ,p.imie, p.nazwisko, d.data, (case when d.zmiana = 'R' then 'ranna 7:00 - 15:00' else 'dzienna 15:00 - 23:00' END), o.nazwa as oddzial 
										from proj.pracownik p 
											join proj.pielegniarz l on p.pracownik_id = l.pielegniarz_id
											join proj.oddzial o USING(oddzial_id)
											join proj.pracownik_dyzur pd USING(pracownik_id) 
											join proj.dyzur d using(dyzur_id) 
										where d.data = $1;
END;
$$ language plpgsql;


select * from api_dyzury_pieleg('20-01-2025');

-- zwraca wizyty dla lekarza z danej daty
create or replace function api_wizyty_lekarze(DATE, TEXT)
RETURNS TABLE(wizyta TEXT, data DATE, godzina TIME, pracownik_id INT, nazwisko text) as
$$
BEGIN

	return query
	select rw.opis as wizyta, w.data as data, w.godzina as godzina, p.pracownik_id, p.nazwisko 
							from proj.wizyta w 
								join proj.rodzaj_wizyty rw USING(rodzaj_wizyty_id)
								join proj.lekarz l USING(lekarz_id) 
								join proj.pracownik p on p.pracownik_id = l.lekarz_id
							where w.data = $1 and p.nazwisko ilike $2 || '%' ;
					
end;
$$ language plpgsql;

select * from api_wizyty_lekarze('20-01-2025', 'Zie');


-- sprawdzenie ilosci wizyt dla lekarzy z danego miesiaca- $1 z roku - $2
create or replace function api_wizyty_lekarze_stat(INT, INT)
RETURNS TABLE(imie TEXT, nazwisko TEXT, ilosc_wizyt BIGINT) as
$$
BEGIN

	return query
	select p.imie, p.nazwisko, COUNT(*) as ilosc_wizyt 
					from proj.lekarz l
						join proj.pracownik p on l.lekarz_id = p.pracownik_id
						join proj.wizyta w USING(lekarz_id)
					where extract(month from w.data) = $1  and extract(YEAR from w.data) = $2
						group by p.imie, p.nazwisko 
					order by ilosc_wizyt;
				
end;
$$ language plpgsql;

select * from api_wizyty_lekarze_stat(1, 2025);



