# Bitácora AEW

Calendario y registro personal de todos los shows de AEW desde 2019: Dynamite, Collision, Rampage, Dark, Elevation, especiales y pay-per-views.

**App:** https://mauricio12cas.github.io/bitacora-aew/

## En el iPhone

- **Instalar:** abre la página en Safari, toca **Compartir → Agregar a pantalla de inicio**. Se abre a pantalla completa, con barra de pestañas, y funciona sin conexión.
- **Tus marcas** se guardan solo en el dispositivo. En **Más → Copia de seguridad** puedes exportarlas a Archivos o iCloud Drive e importarlas después.
- **Calendario de iPhone:** en **Más → Suscribirse en Calendario** (o abre `webcal://mauricio12cas.github.io/bitacora-aew/aew.ics`) para ver Dynamite, Collision y los PPV en la app Calendario.

## Ver en MyAEW

Los episodios de 2019 a 2021 (Dynamite, Rampage, PPV y especiales) tienen un botón **▶ Ver en MyAEW** en su ficha, y en la lista aparece la etiqueta **▶ MyAEW** en los que tienen video. Los enlaces viven en el bloque `MYAEW` de `index.html`, con el id del video en `myaew.com/event/<id>`. Los PPV marcados en `MYAEW_PPV` los vende MyAEW aparte del plan base.

## Datos

Las fechas de PPV y especiales vienen de anuncios oficiales y prensa especializada; los episodios semanales se generan con el horario regular de cada programa. Todo vive en el bloque `DATA` de `index.html`. Después de editarlo, regenera la suscripción de calendario:

```bash
node tools/build-ics.mjs
```

Es un proyecto de fan, sin relación oficial con All Elite Wrestling.
