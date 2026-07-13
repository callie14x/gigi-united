# Wedstrijden automatisch tonen

## Eerste elftal
Open `data/eerste-elftal-wedstrijden.json`. Voeg wedstrijden toe met datum, type, competitie, thuisclub, uitclub, locatie en logo’s. De website kiest automatisch:
- de eerstvolgende officiële competitie- of bekerwedstrijd voor Home en Eerste elftal;
- als die nog niet bestaat: de eerstvolgende andere wedstrijd;
- de eerstvolgende thuiswedstrijd voor Tickets.

## Jeugdacademie
De jeugdpagina leest `fixtures` uit `data/academy.json` en kiest automatisch de eerstvolgende wedstrijd met type `Jeugdcompetitie`.
