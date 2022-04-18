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
| voterName  | string | ano     |

Příklad:

```json
{
  "optionId": 1,
  "voterName": "John"
}
```

- `optionId` udává `id` možnosti, pro kterou chceme hlasovat.
- `voterName` udává jméno hlasujícího. Musí být řetězec nenulové délky o délce maximálně 12.
