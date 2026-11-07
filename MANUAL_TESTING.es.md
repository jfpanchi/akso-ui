# Guion de pruebas manuales

_[Read in English](./MANUAL_TESTING.md)_

Las pruebas automáticas solo detectan una parte de los problemas. Este guion es para personas que usan, o quieren probar, un lector de pantalla, control por voz u otra tecnología de asistencia. No hace falta saber programar.

Cada componente lleva unos 10 minutos. Prueba uno o todos: cada resultado ayuda.

Las páginas de prueba están en inglés, así que los textos entre comillas son los que vas a oír o ver.

## Antes de empezar

1. **Abre las páginas de prueba.** El enlace al sitio está en la sección "About" del repositorio en GitHub. Cada componente tiene una página en `/test/<nombre>`, por ejemplo `/test/dialog`. Cada página muestra solo el ejemplo, sin nada más.
2. **Elige con qué vas a probar.** Cualquiera de estas combinaciones ayuda:

   | Tecnología de asistencia | Navegador | Sistema |
   | --- | --- | --- |
   | NVDA (gratis) | Chrome o Firefox | Windows |
   | JAWS | Chrome | Windows |
   | VoiceOver (incluido) | Safari | macOS |
   | VoiceOver (incluido) | Safari | iPhone o iPad |
   | TalkBack (incluido) | Chrome | Android |
   | Control por voz (incluido) | Safari | macOS o iOS |

   También puedes probar sin lector de pantalla: solo con el teclado, con el zoom al 400 % o con los temas de contraste de Windows. Cada forma encuentra problemas distintos.

3. **Anota** tu sistema, navegador y tecnología de asistencia, con la versión si puedes.

## Comandos básicos

Los lectores de pantalla tienen muchos comandos. Con estos basta para este guion.

| Acción | NVDA / JAWS (Windows) | VoiceOver (Mac) | VoiceOver (iPhone) | TalkBack (Android) |
| --- | --- | --- | --- | --- |
| Activar | NVDA: <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>. JAWS: abre la app | <kbd>Cmd</kbd>+<kbd>F5</kbd> | Ajustes → Accesibilidad → VoiceOver | Ajustes → Accesibilidad → TalkBack |
| Elemento siguiente / anterior | <kbd>↓</kbd> / <kbd>↑</kbd> | <kbd>Ctrl</kbd>+<kbd>Option</kbd>+<kbd>→</kbd> / <kbd>←</kbd> | Desliza a la derecha / izquierda | Desliza a la derecha / izquierda |
| Siguiente control | <kbd>Tab</kbd> | <kbd>Tab</kbd> (mira la nota de abajo) | — | — |
| Activar un control | <kbd>Enter</kbd> o <kbd>Espacio</kbd> | <kbd>Ctrl</kbd>+<kbd>Option</kbd>+<kbd>Espacio</kbd> | Doble toque | Doble toque |
| Callar | <kbd>Ctrl</kbd> | <kbd>Ctrl</kbd> | Toque con dos dedos | Toque con dos dedos |

En Safari para Mac, <kbd>Tab</kbd> se salta los botones y enlaces por defecto. Actívalo en Safari → Ajustes → Avanzado → "Pulsar Tab para resaltar cada ítem de una página web".

## Comprobaciones para todos los componentes

Hazlas en cada página y después sigue los pasos del componente.

- [ ] **Nombre.** Cada control dice para qué sirve, por ejemplo "Edit profile, botón". Nada se lee solo como "botón" o "clicable".
- [ ] **Estado.** Si algo puede estar encendido o apagado, abierto o cerrado, o seleccionado, el lector lo dice, y lo vuelve a decir cuando cambia.
- [ ] **Teclado.** Puedes llegar a todo y usarlo solo con el teclado, en un orden que tiene sentido.
- [ ] **Foco visible.** Al pulsar <kbd>Tab</kbd> siempre ves dónde estás.
- [ ] **Zoom.** Con el zoom del navegador al 200 % y al 400 %, nada se corta y no hace falta desplazarse de lado para leer.
- [ ] **No solo color.** Los errores, estados y mensajes se entienden sin ver los colores: también hay un ícono o un texto.
- [ ] **Lenguaje.** Los textos son cortos y claros.

## Pasos para cada componente

En cada paso, anota: ✅ funciona como se describe, ⚠️ funciona pero algo confunde, o ❌ no funciona. Agrega lo que oíste o viste.

### Accordion — `/test/accordion`
1. Recorre la página por encabezados. Cada pregunta ("How long does shipping take?"…) es un encabezado y un botón.
2. Abre una con <kbd>Enter</kbd> o <kbd>Espacio</kbd>. Oyes "expandido" y puedes leer la respuesta justo después del botón.
3. Ciérrala. Oyes "contraído".
4. Con todo cerrado, busca en la página una palabra de una respuesta (<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>F</kbd>). En Chrome, la sección se abre sola.

### Alert — `/test/alert`
1. Lee la página. Cada mensaje dice su tipo con palabras (Information, Done, Warning, Error) y tiene un título como "Payment received".
2. El tipo se entiende sin ver el color.
3. Estos mensajes ya están en la página al cargarla, así que el lector no los lee solo. Es lo esperado.

### Alert dialog — `/test/alert-dialog`
1. Activa "Delete account". Oyes la pregunta "Delete your account?" y el foco está en "Keep my account", la opción segura.
2. Intenta salir del diálogo con <kbd>Tab</kbd> o deslizando. Sigues dentro.
3. Pulsa <kbd>Escape</kbd>. El diálogo se cierra y el foco vuelve a "Delete account".
4. Ábrelo otra vez y elige "Delete account". Oyes "Account deleted."

### Autocomplete — `/test/autocomplete`
1. Ve al campo "City". Oyes su nombre.
2. Escribe "Gu". Aparecen sugerencias y oyes cuántas hay.
3. Recórrelas con <kbd>↓</kbd> / <kbd>↑</kbd> y elige una con <kbd>Enter</kbd>. El campo queda con esa ciudad.
4. Escribe una ciudad que no está en la lista. Tu texto se queda: no es obligatorio elegir una sugerencia.
5. Usa el botón para borrar. El campo queda vacío.

### Button — `/test/button`
1. Recorre todos los botones. Cada uno tiene un nombre claro. El botón que solo tiene ícono se lee como "Settings".
2. El botón desactivado se lee como no disponible (atenuado o desactivado).
3. Activa el botón de carga. Oyes "Saving" y se entiende que está ocupado.

### Checkbox — `/test/checkbox`
1. "Remember me on this device": oyes su nombre y si está marcada.
2. Cámbiala con <kbd>Espacio</kbd> (o doble toque). Oyes el nuevo estado.
3. La casilla desactivada se lee como no disponible.

### Checkbox group — `/test/checkbox-group`
1. Al entrar al grupo oyes la pregunta: "How should we contact you?".
2. Cada opción (Email, Text message, Phone call) dice si está marcada.

### Collapsible — `/test/collapsible`
1. "Show order details" dice "contraído".
2. Ábrelo. Oyes "expandido" y puedes leer los detalles justo después del botón.

### Combobox — `/test/combobox`
1. Ve al campo "Country". Oyes su nombre y la ayuda "Start typing to filter the list."
2. Escribe "co". La lista muestra solo los países que coinciden y oyes cuántos hay.
3. Escribe algo que no coincida con nada. Oyes "No results".
4. Elige un país con las flechas y <kbd>Enter</kbd>. El campo queda con ese país.
5. Pulsa <kbd>Escape</kbd> con la lista abierta. La lista se cierra y sigues en el campo.

### Dialog — `/test/dialog`
1. Activa "Edit profile". Oyes el título "Edit profile" y "Change your name and press Save."
2. No puedes salir del diálogo con <kbd>Tab</kbd> ni deslizando.
3. Pulsa <kbd>Escape</kbd>. Se cierra y el foco vuelve a "Edit profile".
4. Ábrelo otra vez, cambia el nombre y pulsa Save. Oyes "Profile saved."

### Drawer — `/test/drawer`
1. Activa "Show filters". Se abre un panel y oyes "Filters".
2. Pulsa <kbd>Escape</kbd> o "Close". Se cierra y el foco vuelve al botón.
3. Activa "Order summary". Usa "Show more" para hacer el panel más alto. El botón dice si está expandido.
4. Puedes hacer todo sin deslizar ni arrastrar.

### Field — `/test/field`
1. El campo "Email" dice que es obligatorio. En pantalla ves "(required)".
2. Oyes la ayuda "We only use it to reply to you."
3. Escribe "abc" y sal del campo. Oyes el error y en pantalla tiene un ícono, no solo texto rojo.

### Fieldset — `/test/fieldset`
1. Al entrar a "Street and number" también oyes el nombre del grupo: "Delivery address".
2. Cada campo (Street and number, City, Postal code) tiene su propio nombre.

### Form — `/test/form`
1. Pulsa el botón de enviar sin llenar nada. El foco va al primer campo con error y oyes el error. También oyes cuántos campos hay que revisar.
2. Llena todos los campos y envía. Oyes "Message sent. We will reply within 2 days."

### Resumen de errores — `/test/form-summary`
1. Envía sin llenar nada. El foco va a un recuadro con el título "There is a problem" y el lector lo lee.
2. El recuadro tiene un enlace por cada error. Al activar un enlace, el foco va a ese campo.

### Input — `/test/input`
1. Cada campo (Phone number, Discount code, Account number) tiene nombre y su texto de ayuda.
2. En el teléfono, el teclado que se abre corresponde al campo: números para el teléfono.

### Menu — `/test/menu`
1. Activa "File actions". El menú se abre y el foco está en la primera opción.
2. Muévete con <kbd>↓</kbd> / <kbd>↑</kbd>. "Move (not available)" se lee como no disponible.
3. En "Share", pulsa <kbd>→</kbd>. Se abre un submenú en "Copy link". <kbd>←</kbd> lo cierra.
4. "Show hidden files" dice si está marcada.
5. Elige "Copy link". El menú se cierra, el foco vuelve a "File actions" y oyes "Link copied."

### Meter — `/test/meter`
1. "Storage used" y "Battery" dicen su valor, por ejemplo un porcentaje.
2. El valor se entiende sin ver el color.

### Navigation menu — `/test/navigation-menu`
1. En la lista de regiones o puntos de referencia hay una navegación llamada "Store".
2. "Products" dice "contraído". Ábrelo y puedes llegar a Phones, Laptops y Accessories.
3. <kbd>Escape</kbd> lo cierra y el foco vuelve a "Products".

### Popover — `/test/popover`
1. El botón "About delivery times" abre un panel con el título "Delivery times".
2. Puedes leer el contenido y usar "Close".
3. <kbd>Escape</kbd> lo cierra y el foco vuelve al botón.

### Number field — `/test/number-field`
1. "Guests" dice su nombre, que es obligatorio, su valor y "From 1 to 8 people."
2. <kbd>↑</kbd> / <kbd>↓</kbd> cambian el valor de 1 en 1. <kbd>Inicio</kbd> y <kbd>Fin</kbd> van a 1 y a 8.
3. <kbd>Tab</kbd> va al siguiente campo, no a los botones − y +. Con un lector de pantalla táctil igual puedes llegar a "Decrease" e "Increase".
4. Borra el valor y sal del campo. Oyes "Enter the number of guests."
5. "Price per night" se lee con su moneda, como "$80".

### Progress — `/test/progress`
1. "Uploading photo" dice cuánto lleva.
2. "Step 2 of 4" se entiende.
3. "Preparing your download" dice que está ocupado, sin un número.

### Radio group — `/test/radio-group`
1. Al entrar al grupo oyes "Delivery speed".
2. Las flechas se mueven entre "Standard" y "Express" y eligen la opción. El precio y los días se leen con cada opción.
3. Envía sin elegir. Oyes "Choose a delivery speed."

### Select — `/test/select`
1. "Time zone" dice su nombre y el valor elegido, o "Choose a time zone".
2. Abre la lista. Se leen los grupos, como "Americas".
3. Elige con las flechas y <kbd>Enter</kbd>. La lista se cierra y oyes el nuevo valor.

### Slider — `/test/slider`
1. "Volume" dice su valor. Las flechas lo cambian de 5 en 5.
2. "Room temperature" dice el valor con su unidad, como "21 degrees".
3. <kbd>Inicio</kbd> y <kbd>Fin</kbd> van al mínimo y al máximo. En el teléfono, deslizar hacia arriba o abajo (o las teclas de volumen con TalkBack) cambia el valor.

### Switch — `/test/switch`
1. "Email notifications" dice si está encendido o apagado.
2. Cámbialo. Oyes el nuevo estado y "Email notifications on." u "off."
3. "Beta features (not available)" se lee como no disponible.

### Tabs — `/test/tabs`
1. Oyes el grupo "Account settings" y la pestaña seleccionada.
2. <kbd>←</kbd> / <kbd>→</kbd> pasan entre Profile, Password y Notifications, y muestran su contenido.
3. <kbd>Tab</kbd> va de la pestaña a su contenido.

### Textarea — `/test/textarea`
1. "Your feedback" dice su nombre y "Up to 500 characters."
2. Mientras escribes, en pantalla se ven los caracteres que quedan. Solo los oyes cerca del final (quedan 20, 10 y 0), no con cada tecla.

### Toast — `/test/toast`
1. Pulsa "Save". Oyes "Changes saved" sin perder tu lugar en la página.
2. Muestra "Message archived". Pulsa <kbd>F6</kbd> para llegar a la notificación y usa "Undo". Oyes "Message restored" y el foco vuelve a donde estaba.
3. La notificación de error ("Upload failed") también se lee, con su texto.
4. Las notificaciones no desaparecen mientras las estás leyendo o tienen el foco.

### Toggle — `/test/toggle`
1. "Mute notifications" se lee como un botón no presionado. "Bold" se lee como presionado.
2. Presiona "Mute notifications" con <kbd>Espacio</kbd> (o doble toque). Oyes "presionado" y el nombre no cambia.
3. En pantalla, un botón presionado está relleno y tiene una barra abajo, así que se distingue sin ver el color.
4. "Autoplay (not available)" se lee como no disponible.

### Toggle group — `/test/toggle-group`
1. Al entrar al primer grupo oyes "Text alignment". En el segundo, "Text style".
2. En "Text alignment", <kbd>←</kbd> / <kbd>→</kbd> pasan entre Left, Center y Right. <kbd>Espacio</kbd> presiona uno y suelta los demás.
3. En "Text style", Bold, Italic y Underline pueden estar presionados a la vez.
4. <kbd>Tab</kbd> sale del grupo en vez de pasar por cada botón.

### Tooltip — `/test/tooltip`
1. Los botones con ícono se leen como "Bold" e "Italic".
2. Con el teclado, el tooltip aparece cuando el botón tiene el foco. <kbd>Escape</kbd> lo oculta.
3. No hay nada importante que esté solo en un tooltip.

## Comprobaciones extra sin lector de pantalla

- **Temas de contraste de Windows** (Configuración → Accesibilidad → Temas de contraste): los botones, campos, marcas de las casillas, interruptores, barras y el anillo de foco se siguen viendo.
- **Control por voz** (Mac o iPhone): di el comando para hacer clic seguido del nombre visible: en inglés, "Click Edit profile". Funciona con todos los controles.
- **Reducir movimiento** (ajuste del sistema): los paneles y diálogos se abren sin animación.

## Envía tus resultados

[Abre un reporte de prueba](https://github.com/jfpanchi/akso-ui/issues/new?template=manual-test-report.yml) en GitHub y pega tus notas. Si no usas GitHub, cualquier formato sirve: una lista de ✅ / ⚠️ / ❌ por paso, con tu sistema, navegador y tecnología de asistencia.

Personas que mantienen el proyecto: anoten cada resultado en la tabla "Manual testing" de ese componente en [ACCESSIBILITY.md](./ACCESSIBILITY.md).

Gracias. Cada reporte hace que los componentes funcionen mejor para alguien.
