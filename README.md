# Projekt Kuro README

Dieses Repository enthält den Code für das Backend von Projekt `Kuro`.
Ziel des Projektes ist es ein Monitoring für den Zustand der Supermärkte in Krisenzeiten zu erreichen, um so beispielsweise dem "hamstern" beim einkaufen vorzubeugen.

## Beschreibung

Die Komponente realisiert einen API Server, mit dem `Kuro` Clients kommunizieren können, um Informationen zu erlangen oder serverseitig aufzufrischen.

Die Projekt Basis ist dieses `ExpressJs` & `MongoDb` Boilerplate Projekt von [gothinkster](./GoThinkster.md), welches wir um `Typescript`erweitert haben.

Dann wurde gemeinsam ein Konzept für das Design der API entwickelt und umgesetzt, dabei wurde bereits von anfang an mit `Postman` `<HIER LINK einsetzen>` getestet, ob alles funktioniert wie geplant um keine Zeit zu verlieren.

## Ausblick

Die genannten Punkte sind geplant:

* Test-Pipeline
* (Re)Integration Swagger UI
* Docker
* CI/CD - Integration

## Installation und Benutzung

Um den Code zu benutzen bedarf es folgender Schritte:

1. Repository klonen
2. `Dependencies` installieren (`yarn install`)
3. `yarn run mongo:start` zum starten einer lokalen Mongo instanz (setzt `docker` vorraus).
4. `yarn run dev` um die lokale Entwicklungsumgebung zu starten. (Code kann, nach Änderung, neu geladen werden).

## Dokumentation

// TODO

### API
[Postman API Documentation](https://documenter.getpostman.com/view/4294690/SzS8rjyg?version=latest)

## Beteiligte

Hier werden alle (maßgeblich) an der Entwicklung des Backends beteiligten Leute aufgelistet.

### Api Design & Development

Datenbankdesgin[Tobias Lahmann](https://github.com/tlahmann)

API Design [Sven Patrick Meier](https://github.com/svenpatrickmeier)

### Datenbeschaffungs & -parsing Lib

Mapdaten für Shops [Timo Netzer](https://github.com/exodiquas)
