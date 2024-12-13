-- w tym pliku znajduja sie zapytania do bazy danych, ktore aplikacja bedzie wykonywac
set search_path to proj;
set datestyle to european;

-- wyswietlenie informacji o oddzialach
create view oddzialy_view as
select 
					o.nazwa, 
                    o.nr_budynku, 
                    CONCAT(p1.imie, ' ', p1.nazwisko) as ordynator,  
                    CONCAT(p2.imie, ' ', p2.nazwisko) as oddziałowy 
                FROM proj.oddzial o 
                JOIN proj.pracownik p1 ON p1.pracownik_id = o.ordynator 
                JOIN proj.pracownik p2 ON p2.pracownik_id = o.oddzialowy;
               
select * from oddzialy_view;


-- podstawowe dane pacjentow aby ulatwic wprowadzanie ich do wizyt
select pacjent_id, imie, nazwisko, nr_telefonu, ulica 
				from pacjent
			where nazwisko like 'Kow' || '%';
		
		
-- podstawowe informacje na temat lekarzy
select pracownik_id, imie, nazwisko, nr_telefonu, o.oddzial_id, o.nazwa as oddzial 
	from pracownik p
		join lekarz l on p.pracownik_id = l.lekarz_id
		join oddzial o USING(oddzial_id)
	where o.nazwa like 'Neu%';
	
-- podstawowe informacje na temat pielegniarzy
select pracownik_id, imie, nazwisko, nr_telefonu, o.oddzial_id, o.nazwa as oddzial 
	from pracownik p
		join pielegniarz l on p.pracownik_id = l.pielegniarz_id
		join oddzial o USING(oddzial_id)
	where o.nazwa like 'Neu%';


-- wyswietlanie dostepnych rodzajow wizyt oraz lekarzow ktorych mozemy do nich przypisac
-- potencjalnie ma za zadanie ulatwic przypisywanie lekarza do wizyty
create view lekarz_dla_wizyty_view AS
select  rw.rodzaj_wizyty_id, rw.opis, string_agg(CONCAT('id:',p.pracownik_id,' ', p.imie,' ', p.nazwisko),', ') as dostepni_pracownicy 
		from rodzaj_wizyty rw
			join lekarz l USING(oddzial_id)
			join pracownik p ON p.pracownik_id = l.lekarz_id 
		group by rw.rodzaj_wizyty_id, rw.opis;
	
select * from lekarz_dla_wizyty_view;
		


-- wyswietlenie kto ma dyzur danego dnia z jakiego oddzialu dla lekarzy
select p.pracownik_id ,p.imie, p.nazwisko, d.data, (case when d.zmiana = 'R' then 'ranna 7:00 - 15:00' else 'dzienna 15:00 - 23:00' END), o.nazwa as oddzial 
										from pracownik p 
											join lekarz l on p.pracownik_id = l.lekarz_id
											join oddzial o USING(oddzial_id)
											join pracownik_dyzur pd USING(pracownik_id) 
											join dyzur d using(dyzur_id) 
										where d.data = '20-01-2025';
																		
	

-- to samo tylko dla pielegniarzy - dlaczego oddzial_id jest w lekarz i pielegniarz zalozenie ze istnieja pracownicy ktorzy nie naleza do oddzialu, ktorych chcielibysmy trzymac w tabeli pracownicy
select p.pracownik_id ,p.imie, p.nazwisko, d.data, (case when d.zmiana = 'R' then 'ranna 7:00 - 15:00' else 'dzienna 15:00 - 23:00' END), o.nazwa as oddzial 
										from pracownik p 
											join pielegniarz l on p.pracownik_id = l.pielegniarz_id
											join oddzial o USING(oddzial_id)
											join pracownik_dyzur pd USING(pracownik_id) 
											join dyzur d using(dyzur_id) 
										where d.data = '20-01-2025';




-- wyswietlenie wizyt dla lekarza w danym dniu 
select rw.opis as wizyta, w.data as data, w.godzina as godzina, p.pracownik_id, p.nazwisko 
						from wizyta w 
							join rodzaj_wizyty rw USING(rodzaj_wizyty_id)
							join lekarz l USING(lekarz_id) 
							join pracownik p on p.pracownik_id = l.lekarz_id
						where w.data = '20-01-2025' and p.nazwisko like 'Zieli%' ;

---------------------------------------------------------------
-- wyswietlenie salda dla kazdego pacjenta ktory zalega z platnosciami
-- TO DO
---------------------------------------------------------------

-- zarobki jakie uzyskano w przeciagu ostatniego miesiaca dla kazdego oddzialu
-- TRZEBA PRZETESTOWAC KIEDY WIECEJ WIZYT BEDZIE
create view przychody_dla_oddzialow_view as
select o.oddzial_id, o.nazwa, SUM(rw.cena) as przychody 
					from oddzial o 
						join rodzaj_wizyty rw USING(oddzial_id)
						join wizyta w USING(rodzaj_wizyty_id)
					group by o.oddzial_id, o.nazwa;
					
select * from przychody_dla_oddzialow_view;


-- sprawdzenie statystyk ile wizyt mial poszczegolny lekarz w danym miesiacu roku
select p.imie, p.nazwisko, COUNT(*) as ilosc_wizyt 
					from lekarz l
						join pracownik p on l.lekarz_id = p.pracownik_id
						join wizyta w USING(lekarz_id)
					where extract(month from w.data) = 1  and extract(YEAR from w.data) = 2025-- sprawdzenie dla stycznia 2025
						group by p.imie, p.nazwisko 
					order by ilosc_wizyt;
