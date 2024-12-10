-- testowanie insertów dla pacjentów oraz wizyt
set search_path to proj;

insert into pacjent(imie, nazwisko, PESEL, miejscowosc, ulica, nr_domu, nr_lokalu, nr_telefonu) values
('Jan', 'Kowalski', '44051401359', 'Kraków', 'Mazowiecka', 12, 5, '123456789'),
('Anna', 'Nowak', '55010204032', 'Kraków', 'Jagiellońska', 23, 3, '987654321'),
('Marek', 'Wiśniewski', '66040301510', 'Kraków', 'Długa', 15, 7, '456789012'),
('Magda', 'Wójcik', '77070502512', 'Kraków', 'Kopernika', 7, 2, '789012345'),
('Piotr', 'Kamiński', '88080903641', 'Kraków', 'Grunwaldzka', 19, 1, '321654987'),
('Elżbieta', 'Lewandowska', '99061204722', 'Kraków', 'Sienkiewicza', 5, 4, '654987321'),
('Krzysztof', 'Zielinski', '12030305883', 'Kraków', 'Piotrkowska', 31, 6, '321987654'),
('Monika', 'Szymańska', '22060704914', 'Kraków', 'Aleje Solidarności', 8, 5, '432109876'),
('Adam', 'Jankowski', '33070906725', 'Kraków', 'Chorzowska', 42, 1, '876543210'),
('Karolina', 'Dąbrowska', '44050607836', 'Kraków', 'Kochanowskiego', 11, 8, '987123456'),
('Tomasz', 'Kwiatkowski', '55041108947', 'Kraków', 'Wielopole', 17, 2, '654321987'),
('Agnieszka', 'Wieczorek', '66032009058', 'Kraków', 'Targowa', 21, 3, '123789456'),
('Michał', 'Piotrowski', '77041301269', 'Kraków', 'Morska', 29, 4, '321987654'),
('Zofia', 'Kaczmarek', '88090702370', 'Kraków', 'Królowej Jadwigi', 13, 7, '456123789'),
('Wojciech', 'Wróblewski', '99081203481', 'Kraków', 'Wawelska', 4, 2, '654321321'),
('Dorota', 'Michałowska', '55030104592', 'Kraków', 'Nowa', 10, 5, '789654123'),
('Robert', 'Sikora', '66060205603', 'Kraków', 'Żeromskiego', 33, 6, '987321654'),
('Patryk', 'Sierżant', '77010406714', 'Kraków', 'Grodzka', 20, 1, '432654987'),
('Natalia', 'Bąk', '88050707825', 'Kraków', 'Krakowska', 12, 3, '321123987'),
('Jakub', 'Pawlak', '99081008936', 'Kraków', 'Wieliczka', 2, 7, '123321654'),
('Joanna', 'Sowa', '55010509047', 'Kraków', 'Stradomska', 19, 4, '654456789'),
('Jakub', 'Biel', '66050709158', 'Kraków', 'Batorego', 14, 8, '789789123'),
('Katarzyna', 'Wagner', '77020910269', 'Kraków', 'Pawia', 3, 6, '123987654'),
('Mariusz', 'Wawrzyniak', '88061511370', 'Kraków', 'Słowackiego', 11, 5, '654654987'),
('Beata', 'Szarzec', '99042312481', 'Kraków', 'Jana Pawła II', 8, 2, '987123321'),
('Łukasz', 'Pietrzak', '55051713592', 'Kraków', 'Biskupa Jordana', 25, 7, '321456789'),
('Marta', 'Stefanowska', '66071214703', 'Kraków', 'Karmelicka', 4, 5, '123654321'),
('Marek', 'Fedorowicz', '77081615814', 'Kraków', 'Piłsudskiego', 16, 8, '789321654'),
('Patrycja', 'Górska', '88092016925', 'Kraków', 'Mickiewicza', 9, 4, '321654987'),
('Adrian', 'Kołodziej', '99050217136', 'Kraków', 'Lwowska', 27, 2, '432123987'),
('Joanna', 'Jóźwiak', '55090718247', 'Kraków', 'Błonia', 13, 1, '654987321'),
('Sebastian', 'Krzak', '66071019358', 'Kraków', 'Św. Anny', 5, 6, '987654123'),
('Olga', 'Nowakowska', '77012120469', 'Kraków', 'Rondo Mogilskie', 12, 3, '321987654'),
('Karol', 'Kaczmarczyk', '88080621570', 'Kraków', 'Pawia', 23, 2, '123456987'),
('Justyna', 'Zawisza', '99031022681', 'Kraków', 'Michałowskiego', 7, 5, '654123987'),
('Piotr', 'Kosmatka', '55040123792', 'Kraków', 'Sienkiewicza', 20, 4, '432987654'),
('Elżbieta', 'Czajka', '66060824803', 'Kraków', 'Sukiennice', 15, 6, '789654321'),
('Grzegorz', 'Zieliński', '77081425914', 'Kraków', 'Twardowskiego', 9, 1, '123321987'),
('Sylwia', 'Marek', '88070627025', 'Kraków', 'Kazimierza', 4, 8, '654654123');

select * from pacjent;

-- dodawanie do wizyta

select * from rodzaj_wizyty;


insert INTO(wizyta_id SERIAL,
					pacjent_id,
					data,
					godzina,
					rodzaj_wizyty_id,
					lekarz_id)
