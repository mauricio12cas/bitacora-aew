# Bitácora AEW

Calendario y registro personal de todos los shows de AEW desde 2019: Dynamite, Collision, Rampage, Dark, Elevation, especiales y pay-per-views.

**App:** https://mauricio12cas.github.io/bitacora-aew/

## En el iPhone

- **Instalar:** abre la página en Safari, toca **Compartir → Agregar a pantalla de inicio**. Se abre a pantalla completa, con barra de pestañas, y funciona sin conexión.
- **Tus marcas** se guardan en el dispositivo y, si creas un código en **Más → Sincronizar aparatos**, también en Supabase para verlas igual en iPhone, iPad y Mac. En **Más → Copia de seguridad** puedes exportarlas a Archivos o iCloud Drive e importarlas después.
- **Calendario de iPhone:** en **Más → Suscribirse en Calendario** (o abre `webcal://mauricio12cas.github.io/bitacora-aew/aew.ics`) para ver Dynamite, Collision y los PPV en la app Calendario.

## Ver en MyAEW

Los episodios de 2019 a 2026 que están en MyAEW (Dynamite, Collision, Rampage, PPV y especiales) tienen un botón **▶ Ver en MyAEW** en su ficha, y en la lista aparece la etiqueta **▶ MyAEW** en los que tienen video. Los enlaces viven en el bloque `MYAEW` de `index.html`, con el id del video en `myaew.com/event/<id>`. Los PPV marcados en `MYAEW_PPV` los vende MyAEW aparte del plan base.

## Datos

Las fechas de PPV y especiales vienen de anuncios oficiales y prensa especializada; los episodios semanales se generan con el horario regular de cada programa. Todo vive en el bloque `DATA` de `index.html`. Después de editarlo, regenera la suscripción de calendario:

```bash
node tools/build-ics.mjs
```

Es un proyecto de fan, sin relación oficial con All Elite Wrestling.

## Carteleras

Cada episodio de Dynamite, Rampage, Collision, PPV y especiales muestra en su ficha la cartelera de luchas, sin resultados: los participantes van en orden alfabético y se quitan ganadores, tiempos, cambios de título y marcadores. Los datos vienen de Cagematch y viven en `cards.json` (id del episodio → luchas).
