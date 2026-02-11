# Min Budget. 
### _En budget-app skriven i TypeScript 💸_

#### Skapad av:

- [@linasvard](https://github.com/linasvard)

## Case:
> I den här uppgiften ska du skapa en liten "budget-app" där man kan mata in inkomster och utgifter, samt få en balansöversikt.

### Kort sammanfattning av innehåll - _krav_
- Dropdown-meny för att kunna välja kategori, olika baserat på val av transaktion
- Fält för att mata in ugift eller inkomst
- Fält för att beskriva tidigare input (frivillig för användaren)
- En balans som ska uppdateras varje gång användaren lägger in en transaktion
- Varje post ska kunna gå att raderas
- Ska sparas i local storage så att information finns kvar om användare stänger ner webbläsare
- Kategorier ska läsas in via JSON-fil
- Sidan ska givetvis vara responsiv och funka på både mobil och desktop 

### Tillägg - _frivilligt_
_(Detta är innehåll som jag själv implimenterat och anses som extra)_

- Ett datum bredvid varje transaktionspost vilket också sparas och behålls när användaren går tillbaka till listan dagar senare
 
- Användaren kan inte skicka iväg formuläret om vissa krav inte är uppfyllda så som:
  - Enbart siffror på "Summa"-fältet
  - "Summa"-fältet är tomt
  - Kategori ej valt


## Hemsidan/applikationen 
Färger:   


<br>


![Sidans CSS är validerad](image.png) 
![Sidans HTML är validerad](validation-budget.png)

_Sidans CSS och HTML är validerad_ 👆🏻

---

### Tillgänglighetsgranskning:
Nedan visas screenshots från lighthouse 