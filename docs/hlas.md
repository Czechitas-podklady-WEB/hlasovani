---
layout: default
title: Odeslání hlasu
permalink: /hlas
nav_order: 1
---

# Odeslání hlasu

Zahlasování pro nějakou možnost v jedné vybrané otázce. 

## Odeslat hlas [POST]

`{{ site.apibase }}/poll/{id}`

Parametr `id` představuje `id` vybraného hlasování.

Enpoint očekává JSON objekt s těmito vlastnostmi

| Vlastnost  | Typ    | Povinný |
|------------|--------|---------|
| optionId   | number | ano     |



Příklad:

```json
{
  "optionId": 1,
}
```

**Autentizace**: pomocí hlavičky `Authorization` se jmémen uživatele. Jméno uživatele musí být řetězec délky alespoň 3 a maximálně 12.

- `optionId` udává `id` možnosti, pro kterou chceme hlasovat.
