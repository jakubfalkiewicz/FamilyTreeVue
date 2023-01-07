# Serwis genealogiczny

## Opis problemu

- Należy zaprojektować i zaprogramować „serwis genealogiczny”, pozwalający na budowanie „drzew” genealogicznych.
- Serwis:
  - dla zaoferowania jakiejkolwiek funkcjonalności wymaga rejestracji i zalogowania się
  - ma mieć wielu użytkowników,
  - udostępnia „wyszukiwarkę” użytkowników, w których „drzewach genealogicznych” występuje podany __zbiór nazwisk__ połączonych (opcjonalnie) z __datami urodzenia__.
- Użytkownicy mogą
  - komunikować się korzystając ze wspólnego czatu albo prowadząc rozmowy „bilateralne” (historia rozmów powinna być przechowywana), 
  - wykorzystywać dane genealogiczne (fragmenty drzew/grafów) innych użytkowników (bez ingerowania w oryginalne dane)


## Wytyczne technologiczne

- Do realizacji projektu wykorzytaj język `JavaScript` lub `TypeScript` oraz narzędzia: `Node.js`, `Express.js`, `bcrypt.js`, `passsport.js`.
- Dane genealogiczne przechwuj w postaci __grafów__, korzystając z bazy `Neo4J` lub `OrientDB`
- Interfejs użytkownika aplikacji stwórz w oparciu o `Vue.js`

## Uwagi

- Kod „początkowy” czatu wbudowanego w serwis genealogiczny powinien pochodzić z rozwiązania „serii zadań czatowych”. Jego pierwsza wersja w repozytorium projektu powinna być „obrazem” konkretnego „commitu” rozwiązania tychże zadań.
