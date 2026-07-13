# Nieuws toevoegen

Open in GitHub: `data/news.json`.

Elk artikel staat tussen `{ }`. Kopieer een bestaand artikel, zet een komma tussen de artikelen en pas de velden aan.

```json
{
  "slug": "korte-unieke-naam-zonder-spaties",
  "title": "Titel van het nieuwsbericht",
  "date": "2026-07-13",
  "category": "Clubnieuws",
  "summary": "Korte intro voor de homepage en nieuwspagina.",
  "image": "assets/stadium-hero.jpg",
  "imageAlt": "Beschrijving van de foto",
  "content": [
    "Eerste alinea van het uitgebreide verhaal.",
    "Tweede alinea van het uitgebreide verhaal."
  ],
  "gallery": [
    "assets/fans/rossoneri-01.jpg",
    "assets/fans/rossoneri-02.jpg"
  ]
}
```

De website sorteert automatisch op datum. De nieuwste drie artikelen verschijnen op de homepage. Alle artikelen verschijnen op de nieuwspagina. Klikken opent automatisch het volledige artikel.

Voor een artikel zonder galerij gebruik je: `"gallery": []`.
