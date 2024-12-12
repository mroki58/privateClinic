-- w tym pliku znajduja sie zapytania do bazy danych, ktore aplikacja bedzie wykonywac
set search_path to proj;
set datestyle to european;

-- wyswietlanie dostepnych rodzajow wizyt dla oddzialu oraz lekarzow ktorych mozemy do nich przypisac
-- potencjalnie ma za zadanie ulatwic przypisywanie lekarza do wizyty
select  rw.rodzaj_wizyty_id, rw.opis, string_agg(CONCAT('id:',p.pracownik_id,' ', p.imie,' ', p.nazwisko),', ') as dostepni_pracownicy 
		from rodzaj_wizyty rw
			join lekarz l USING(oddzial_id)
			join pracownik p ON p.pracownik_id = l.lekarz_id 
		group by rw.rodzaj_wizyty_id, rw.opis;
		


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
select rw.opis as wizyta, w.data as data, w.godzina as godzina, p.pracownik_id, p.nazwisko from wizyta w 
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
create view przychody_dla_oddzialow as
select o.oddzial_id, o.nazwa, SUM(rw.cena) as przychody from oddzial o 
						join rodzaj_wizyty rw USING(oddzial_id)
						join wizyta w USING(rodzaj_wizyty_id)
					group by o.oddzial_id, o.nazwa;
					
select * from przychody_dla_oddzialow;


-- sprawdzenie statystyk ile wizyt mial poszczegolny lekarz w danym miesiacu roku
select p.imie, p.nazwisko, COUNT(*) as ilosc_wizyt from lekarz l
		join pracownik p on l.lekarz_id = p.pracownik_id
		join wizyta w USING(lekarz_id)
	where extract(month from w.data) = 1  and extract(YEAR from w.data) = 2025-- sprawdzenie dla stycznia 2025
		group by p.imie, p.nazwisko 
	order by ilosc_wizyt;
