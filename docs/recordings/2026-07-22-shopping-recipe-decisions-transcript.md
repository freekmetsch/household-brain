# Transcript: Shopping and Recipe Decisions

_Source: `WhatsApp Audio 2026-07-22 at 13.38.07.mp4` (03:15). Transcribed locally with Whisper large-v3 in Dutch mode. Light punctuation and clear recognition errors were corrected; uncertain wording is marked._

## Dutch transcript

**00:00–00:30**

Wat wil je? In plaats van dat je op maandag het aantal porties steeds met één extra klik wijzigt, vind ik ook de optie om recepten keer twee, keer drie of keer vier te doen. Ah ja, ja. Dat het net iets makkelijker is om het aantal porties te verhogen. Want als je van zestien naar tweeëndertig moet, is het echt irritant: zestien keer klikken.

**00:30–01:38**

En had je die kleur van de combinatie van twee verschillende stappen al gewijzigd? Nee. Ja, dus in de cooking mode, in de kookmodus, is het de bedoeling dat je per [onduidelijk: soort/sectie] in een gerecht één kleur hebt. Maar als die secties worden samengevoegd, dan moeten die twee kleuren samenvoegen. Nu krijg je geen nieuwe derde kleur als je bijvoorbeeld twee losse kleuren samenvoegt, maar dat is wel de bedoeling. Idealiter zijn het dus kleuren die mengen en dan de derde kleur maken. Ja, precies. Dus geel en blauw naar groen bijvoorbeeld. Of geel en oranje naar rood. Wow, dat is wel mooi. Oh, geel en rood naar oranje. Anyway, ja dus. En dat is nu bijna zo, maar nog niet helemaal zo. Dat moet nog even worden aangepast in de cooking mode, de kookmodus.

**01:40–02:01**

En ik denk dat we sowieso even moeten kijken of de kookmodus misschien iets efficiënter kan. Want volgens mij wordt er nu iets te veel door de AI gedaan en kan iets meer van de kookmodus in het programma zitten, zodat de AI minder hoeft te genereren. Dat is mijn vermoeden.

**02:03–03:14**

Dus voor de ingrediënten willen we graag dat als er bijvoorbeeld boter nodig is voor één plek in het recept, bijvoorbeeld boter voor de basis van een taart, en er dan ook nog boter nodig is voor een ander deel van de taart, voor een sausje of zo, dat die los van elkaar staan. Dat is meestal al zo. Maar dat het in de ingrediëntenlijst ook duidelijk is waar het dan voor is. Dat het niet alleen maar een losse ingrediëntenlijst is, maar dat het duidelijk is: dit hoort hierbij.

En dat het tijdens het inkopen, dus tijdens de shopping, de boodschappen, dan wel slim wordt samengevoegd. Of in ieder geval bij elkaar staat. Misschien niet samengevoegd, maar wel bij elkaar staat. En dat je bijvoorbeeld niet twee keer 250 gram boter koopt als je dat bij elkaar niet nodig hebt.

## Requirements extracted for the plan

- Add recipe-yield shortcuts `×1`, `×2`, `×3`, and `×4` to planned meals so a 16-portion recipe can become 32 portions with one action.
- Give a merged cooking branch a new blended color; keep the source colors visible as provenance, then use the blended color for the result and its later steps.
- Keep AI responsible only for recipe interpretation. Derive quantities, language projection, ingredient grouping, progress, serving changes, and color assignment in code.
- Preserve separate ingredient rows and component labels in recipe and cooking views. Keep exact leaf/component provenance through shopping derivation, then sum compatible same-product amounts once for the buy list and AH.
