# Projekt Kuro README

Dieses Repository enthält den Code für das Backend von Projekt `Kuro`.
Ziel des Projektes ist es ein Monitoring für den Zustand der Supermärkte in Krisenzeiten zu erreichen,
um so beispielsweise dem "hamstern" beim einkaufen vorzubeugen.

## Beschreibung

Die Komponente realisiert einen API Server, mit dem `Kuro` Clients kommunizieren können,
um Informationen zu erlangen oder serverseitig aufzufrischen.

Die Projekt Basis ist dieses `ExpressJs` & `MongoDb` Boilerplate Projekt von [gothinkster](./GoThinkster.md), welches wir um `Typescript`erweitert haben.

Dann wurde gemeinsam ein Konzept für das Design der API entwickelt und umgesetzt, dabei wurde bereits von Anfang an mit [`Postman`](https://www.postman.com/) getestet,
ob alles funktioniert wie geplant um keine Zeit zu verlieren.

## Ausblick

Die genannten Punkte sind geplant:

* Unittests mit `jest`
* (Re)Integration Swagger UI
* Docker
* CI/CD - Integration

## Installation und Benutzung

Um den Code zu benutzen bedarf es folgender Schritte:

1. Repository klonen
2. `Dependencies` installieren (`yarn install`)
3. `yarn run mongo:start` zum starten einer lokalen Mongo Instanz (setzt `docker` voraus).
4. `yarn run dev` um die lokale Entwicklungsumgebung zu starten. (Code kann, nach Änderung, neu geladen werden).

## Dokumentation

Hier werden alle Infos bezüglich Dokumentation und weiteren Maßnahmen der Qualitätssicherung beschrieben.

### API

Die API soll zu einem späteren Zeitpunkt noch mit Swagger UI dokumentiert werden, bisher kann "API Dokumentation" mit Hilfe der Postman-tests generieren.
Dazu einfach dem Link folgen: [Postman API Documentation](https://documenter.getpostman.com/view/4294690/SzS8s5Jf?version=latest)

## Beteiligte

Hier werden alle (maßgeblich) an der Entwicklung des Backend beteiligten Leute aufgelistet.

### API Design & Development

Datenbankdesgin [Tobias Lahmann](https://github.com/tlahmann)

API Design [Sven Patrick Meier](https://github.com/svenpatrickmeier)

### Datenbeschaffungs & -parsing Lib

Kartendaten für Shops [Timo Netzer](https://github.com/exodiquas)
