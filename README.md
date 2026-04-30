# Centre Suhevic — web

Adaptación de la plantilla `Davies` (themesflat) a Centre Suhevic — Nuria Suhevic Bellonch (Gavà).

## Estructura

- `index.html` — landing principal (única página de cara al usuario).
- `assets/css/suhevic.css` — overrides puntuales sobre la plantilla.
- `404.html` — adaptado.
- `landing.html`, `version-2.html`, `blog-*.html` — **archivos sobrantes de la plantilla**.
  Borrar antes del despliegue, o dejarlos sin enlazar.

## Compilación SCSS (heredada de la plantilla)

```bash
sass assets/scss/app.scss assets/css/styles.css --watch
```

## Pendientes (placeholders a reemplazar)

Buscar `TODO:` en `index.html` y `assets/css/suhevic.css`. Lista resumen:

- **Logo** del centro (SVG) — ahora hay un wordmark `SUHEVIC®` en texto.
  - Sustituir en cabecera (línea ~85) y en el menú móvil.
  - Sustituir `assets/images/logo/favicon.svg`, `davies-small.svg` (firma de about) y `agency.png` (footer wordmark).
- **Vídeo/foto del hero** — ahora `assets/images/video/corridor.webm`. Reemplazar por imagen/vídeo del centro.
- **Foto/vídeo de Nuria** en sección "Sobre Nuria" — ahora `assets/images/video/davies-video.mp4`.
  Si solo hay foto, sustituir el `<video>` por `<img>`.
- **Imágenes de especialidades** — `assets/images/section/work-1.jpg … work-5.jpg`.
- **Imágenes de servicios** — `service-1.jpg`, `service-2.jpg`, `service-3.jpg`, `service-mini-1.jpg`, `service-mini-2.jpg`, `bg-service-1.jpg…3.jpg`.
- **Bio de Nuria** — texto actual basado en la web pública. Confirmar/ampliar.
- **Paleta** — variable `--suhevic-accent` en `assets/css/suhevic.css` (por defecto verde de la plantilla, `#07C42C`). Cambiar al color de marca cuando esté.
- **Formulario** — actualmente usa `mailto:`. Conectar a Formspree, EmailJS o backend propio.
- **WhatsApp** — botón apunta a `https://wa.me/34936383647` (mismo fijo que el del centro). Confirmar si hay un móvil distinto.
- **Mapa** — embed genérico de Google Maps con la dirección. Sustituir por embed exacto del establecimiento si se quiere precisión.
- **FAQ "mutuas"** — respuesta vaga a la espera de confirmación de Nuria.
- **Meta `og:image`** — añadir cuando haya una imagen social (1200×630).

## Datos del centro usados

- Dirección: Tressols 3 (local izquierdo), 08850 Gavà
- Teléfono: 936 38 36 47
- Email: <secretaria@centresuhevic.com>
- Instagram: <https://www.instagram.com/centrosuhevic/>
- Facebook: <https://www.facebook.com/Centrosuhevic>
