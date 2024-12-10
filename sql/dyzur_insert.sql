-- Tutaj będzie dodawanie elementu tabeli dyżur oraz pracownik_dyżur
-- Również dla wygody 
-- Będzie też można usunąć kogoś z tabeli
set search_path to proj;

-- widok do wstawiania elementu
create view pracownik_dyzur_insert as 
select d.data, d.zmiana, pracownik_id 
		from dyzur d 
			join pracownik_dyzur USING(dyzur_id);
		
		
create or replace function dodaj_dyzur()
returns trigger as $$
DECLARE 
	rec_pracownik_dyzur RECORD;
	_dyzur_id INT;
BEGIN
	SELECT INTO rec_pracownik_dyzur * 
				FROM dyzur d
					JOIN pracownik_dyzur pd USING(dyzur_id)
				WHERE d.data = NEW.data and pd.pracownik_id = NEW.pracownik_id;
	IF FOUND THEN
		RAISE EXCEPTION 'Nie mozna dodac pracownika. Ma już tego dnia dyżur.';
		RETURN NULL;
	END IF;

	INSERT INTO dyzur(data, zmiana) values (NEW.data, NEW.zmiana)
	RETURNING dyzur_id INTO _dyzur_id; 
	
	INSERT INTO pracownik_dyzur VALUES (_dyzur_id, NEW.pracownik_id);
	RETURN NEW;

END
$$ language plpgsql;

create trigger dodanie_dyzuru instead of insert 
on pracownik_dyzur_insert for each row
execute procedure dodaj_dyzur();

-- testy
insert into pracownik_dyzur_insert(data, zmiana, pracownik_id) values ('17-01-2022', 'R', 4);
select * from dyzur;
select * from pracownik_dyzur;
insert into pracownik_dyzur_insert(data, zmiana, pracownik_id) values ('17-01-2022', 'R', 4); --ma nie zadzialac
insert into pracownik_dyzur_insert(data, zmiana, pracownik_id) values ('19-01-2022', 'D', 4); 
