drop schema proj cascade;
create schema proj;

set search_path to proj;

-- nr_lokalu nie zawsze potrzebny
-- nie wszyscy maja numer telefonu
-- pesel dla osob zza granicy nie istnieje
create table pracownik(pracownik_id SERIAL primary KEY, imie text not null, nazwisko text not null,plec VARCHAR(1), PESEL VARCHAR(11) UNIQUE,
	miejscowosc text not null, ulica text not null, nr_domu VARCHAR(4) not null, nr_lokalu VARCHAR(4),
	pensja numeric(7,2) not null, wyksztalcenie text not null, nr_telefonu VARCHAR(12) );
	

-- zmiana dzienna(d) lub ranna(r)
-- dyzur sluzy tylko jako plan na przyszłe tygodnie
-- dlatego bedziemy je usuwac z czasem (po tygodniu albo cos)
create table dyzur(dyzur_id SERIAL primary key, 
					data DATE not null, 
					zmiana VARCHAR(1),
					unique(data, zmiana));
				
-- tablica z której potencjalnie coś chcemy usuwać w przypadku usunięcia dyżuru
create table pracownik_dyzur(dyzur_id INT references dyzur(dyzur_id) on delete cascade ,
							 pracownik_id INT references pracownik(pracownik_id) on delete cascade,
							 constraint pracownik_dyzur_pk primary key(dyzur_id, pracownik_id) );
			
-- oddzial moze byc chwilowo nieprzypisany
create table lekarz(lekarz_id INT primary key references pracownik(pracownik_id),  
					oddzial_id INT);
					
create table pielegniarz(pielegniarz_id INT primary key references pracownik(pracownik_id),
						oddzial_id INT);
				
					
					
create table oddzial(oddzial_id SERIAL primary key, 
					nazwa text not null,
					nr_budynku INT not null,
					ordynator INT references lekarz(lekarz_id),
					oddzialowy INT references pielegniarz(pielegniarz_id));
				
alter table lekarz add foreign key 
(oddzial_id) references oddzial(oddzial_id);

alter table pielegniarz add foreign key 
(oddzial_id) references oddzial(oddzial_id);

create table rodzaj_wizyty(rodzaj_wizyty_id SERIAL primary key,
							opis text,
							cena NUMERIC(7,2) not null,
							oddzial_id INT references oddzial(oddzial_id));
						

create table wizyta(wizyta_id SERIAL primary key,
					pacjent_id INT not null,
					data DATE not null,
					godzina TIME not null,
					rodzaj_wizyty_id INT references rodzaj_wizyty(rodzaj_wizyty_id) on delete set null,
					lekarz_id INT references lekarz(lekarz_id) on delete set null);
				
create table pacjent(pacjent_id SERIAL primary key,
					imie text not null,
					nazwisko text not null,
					PESEL VARCHAR(11) unique,
					miejscowosc text not null, 
					ulica text not null, 
					nr_domu VARCHAR(4) not null, 
					nr_lokalu VARCHAR(4),
					nr_telefonu VARCHAR(12));
				
alter table wizyta add foreign key
(pacjent_id) references pacjent(pacjent_id) 
on delete set NULL;




					

			