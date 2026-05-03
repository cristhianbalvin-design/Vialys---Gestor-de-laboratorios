# VIALYS
## Documento Maestro del Sistema de Gestión de Laboratorio Clínico
### Red de Salud — Provincia de Huarochirí, Lima

---

> *"Del análisis al resultado, sin perder el rastro"*

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Clasificación:** Documento de diseño funcional — Fase 1  
**Elaborado para:** Laboratorio Central C.S. Ricardo Palma — Jefatura Provincial de Laboratorios, Huarochirí

---

## 1. CONTEXTO Y PROBLEMA

El Laboratorio del Centro de Salud Ricardo Palma es la sede central de todos los laboratorios de la provincia de Huarochirí. Actualmente coordina entre 5 y 10 establecimientos de salud distribuidos en la provincia, cada uno con capacidades distintas de toma de muestra y procesamiento.

### Situación actual (proceso manual)

1. El médico llena en papel la **Solicitud Única Estandarizada de Análisis de Laboratorio** (denominada "Orden").
2. La técnica de laboratorio recibe la Orden, toma los datos del paciente y los exámenes solicitados.
3. Se toma la muestra.
4. Se procesa la muestra en los equipos.
5. Los resultados se anotan en un **archivo Excel** como registro.
6. La hoja de resultados se redacta manualmente en una **plantilla Word** y queda anexa a la historia clínica.

### Problemas identificados

- No existe trazabilidad del proceso entre la recepción y la emisión del resultado.
- El jefe provincial no tiene visibilidad en tiempo real de lo que ocurre en cada sede.
- El registro en Excel es individual por sede, sin consolidación provincial.
- La hoja de resultados en Word es propensa a errores y no tiene formato estandarizado.
- No se miden indicadores de producción ni tiempos de procesamiento.
- La gestión de derivaciones entre sedes es completamente informal.

---

## 2. SOLUCIÓN — VIALYS

**Vialys** es una aplicación web PWA (Progressive Web App) que digitaliza y centraliza toda la gestión del laboratorio clínico provincial. Funciona desde el navegador del celular sin necesidad de instalar software, y se adapta también a escritorio.

### Principios de diseño

- **Mobile-first:** diseñado para ser usado con el pulgar en plena jornada.
- **Por roles:** cada usuario ve y puede hacer solo lo que le corresponde.
- **Centralizado:** toda la información de todas las sedes converge en Ricardo Palma.
- **Trazable:** cada acción queda registrada con usuario, sede, fecha y hora.
- **Offline-ready:** PWA con caché básico para zonas con conectividad limitada.

---

## 3. ALCANCE — FASE 1

Esta primera fase cubre exclusivamente la gestión del laboratorio. No incluye médicos, farmacia, ni otras áreas clínicas.

### Incluido en Fase 1

- Registro digital de la Orden
- OCR del DNI del paciente (cámara + consulta RENIEC simulada)
- Gestión de toma de muestra
- Ingreso de resultados por examen
- Generación de Hoja de Resultados (PDF + impresión)
- Dashboard en tiempo real para el jefe provincial
- Reportes e indicadores por sede y tipo de examen
- Administración de usuarios, sedes y catálogo de exámenes

### Fuera de Fase 1

- Integración con historia clínica electrónica
- Módulo médico (solicitud digital de órdenes)
- Integración real con API RENIEC
- Facturación o caja
- Módulo de farmacia o almacén de reactivos

---

## 4. SEDES DEL SISTEMA

| # | Establecimiento | Tipo | Rol en la red |
|---|---|---|---|
| 1 | C.S. Ricardo Palma | Centro de Salud | **Sede Central — Jefatura Provincial** |
| 2 | C.S. Matucana | Centro de Salud | Toma + procesamiento propio |
| 3 | C.S. San Mateo | Centro de Salud | Toma + procesamiento propio |
| 4 | C.S. Chicla | Centro de Salud | Toma + derivación a Ricardo Palma |
| 5 | C.S. Casapalca | Centro de Salud | Toma + derivación a Ricardo Palma |
| 6 | C.S. Surco | Centro de Salud | Solo emisión de orden |
| 7 | C.S. Antioquía | Centro de Salud | Solo emisión de orden |

> El administrador puede agregar, editar o desactivar sedes desde el sistema.

---

## 5. ROLES DEL SISTEMA

Un usuario puede tener uno o más roles asignados simultáneamente. Al iniciar sesión puede seleccionar el modo activo o cambiarlo desde el menú.

### 5.1 Recepción / Registro

**Función:** Digitaliza la Orden en papel que trae el paciente.

Puede:
- Registrar nueva orden (datos del paciente + exámenes solicitados)
- Escanear DNI con cámara (OCR) o consultar RENIEC
- Buscar paciente por DNI o nombre
- Ver lista de órdenes del día de su sede

No puede:
- Ingresar resultados
- Ver dashboard global
- Emitir hoja de resultados

---

### 5.2 Toma de Muestra

**Función:** Registra la extracción de la muestra biológica.

Puede:
- Ver cola de pacientes con orden registrada y muestra pendiente
- Registrar toma de muestra (tipo, hora, condición, observaciones)
- Indicar si la muestra se procesa en la misma sede o se deriva
- Generar código de identificación de muestra (ej: RP-2026-00123)
- Marcar muestra como enviada a otra sede

No puede:
- Ingresar resultados

---

### 5.3 Procesamiento / Análisis

**Función:** Ingresa los resultados de cada examen procesado.

Puede:
- Ver cola de muestras recibidas pendientes de procesar
- Ingresar resultado por examen (valor, unidad, rango referencial)
- Ver indicador automático: NORMAL / ALTO / BAJO / REACTIVO / NO REACTIVO
- Registrar equipo utilizado y observaciones
- Guardar parcialmente y continuar después
- Marcar orden como completa

No puede:
- Emitir el documento final de resultados

---

### 5.4 Emisión de Resultados

**Función:** Valida y emite la Hoja de Resultados oficial.

Puede:
- Ver órdenes con resultados completos pendientes de validación
- Revisar todos los resultados antes de emitir
- Generar Hoja de Resultados (PDF + impresión)
- Confirmar emisión (cambia estado a EMITIDO)

---

### 5.5 Jefe Provincial

**Función:** Supervisión y análisis de toda la red provincial.

Puede:
- Ver dashboard en tiempo real de todas las sedes
- Acceder (solo lectura) a cualquier orden y resultado
- Generar reportes e indicadores
- Exportar reportes en PDF y Excel

No puede:
- Crear, modificar ni eliminar registros

---

### 5.6 Administrador del Sistema

**Función:** Configuración y mantenimiento del sistema.

Puede:
- Gestionar usuarios (nombre, DNI, roles, sede, estado activo/inactivo)
- Gestionar sedes (agregar, editar, activar/desactivar)
- Gestionar catálogo de exámenes (nombre, categoría, unidad, rangos referenciales por sexo y grupo etario)
- Ver log de actividad del sistema

---

## 6. FLUJO PRINCIPAL

```
[Paciente llega con Orden en papel]
        │
        ▼
  RECEPCIÓN registra la Orden en Vialys
  (OCR del DNI + exámenes seleccionados)
        │
        ▼  Estado: REGISTRADA
  TOMA DE MUESTRA registra extracción
  (tipo, hora, condición, código de muestra)
        │
        ├─── Misma sede ──────────────────────────────┐
        │                                             │
        └─── Se deriva a otra sede ──► MUESTRA ENVIADA
                                                      │
                                                      ▼
                                          Estado: MUESTRA TOMADA
                                                      │
                                                      ▼
                                        PROCESAMIENTO ingresa resultados
                                        (valor, unidad, rango, indicador)
                                                      │
                                                      ▼
                                          Estado: EN PROCESO
                                                      │
                                          (puede ser parcial)
                                                      │
                                                      ▼
                                          Estado: RESULTADOS COMPLETOS
                                                      │
                                                      ▼
                                        EMISIÓN valida y genera PDF
                                                      │
                                                      ▼
                                          Estado: EMITIDO
                                        (queda en historia clínica)
```

Cada cambio de estado registra: **usuario · sede · fecha · hora**

---

## 7. ESCENARIOS MULTI-SEDE

Al registrar la Orden se indica: sede de origen, sede de toma de muestra y sede de procesamiento. Esto permite cuatro escenarios:

| Escenario | Origen de la Orden | Toma de Muestra | Procesamiento | Emisión |
|---|---|---|---|---|
| A | Ricardo Palma | Ricardo Palma | Ricardo Palma | Ricardo Palma |
| B | Sede periférica | Misma sede periférica | Misma sede periférica | Misma sede periférica |
| C | Sede periférica | Sede periférica | Ricardo Palma | Ricardo Palma |
| D | Sede periférica | Ricardo Palma | Ricardo Palma | Ricardo Palma |

La orden es visible para todas las sedes involucradas en cada paso del proceso.

---

## 8. CATÁLOGO DE EXÁMENES

### 8.1 Hematología
- Hemograma completo
- Hematocrito
- Hemoglobina
- Grupo sanguíneo y Rh
- Tiempo de coagulación
- Tiempo de sangría
- Recuento de plaquetas

### 8.2 Bioquímica / Química Sanguínea
- Glucosa
- Urea
- Creatinina
- Ácido úrico
- Colesterol total
- Triglicéridos
- HDL
- LDL
- TGO (AST)
- TGP (ALT)
- Bilirrubina total
- Bilirrubina directa
- Bilirrubina indirecta
- Proteínas totales
- Albúmina

### 8.3 Microbiología / Cultivos
- Cultivo de orina
- Cultivo de heces
- Cultivo de esputo
- BK esputo (baciloscopia)
- Gram de secreción

### 8.4 Inmunología / Serología
- RPR / VDRL
- VIH (prueba rápida)
- HBsAg
- Prueba de embarazo
- PCR cualitativa
- Widal

### 8.5 Uroanálisis / Coprológico
- Examen completo de orina
- Examen parasitológico de heces
- Coprocultivo
- Test de Graham

> El catálogo es configurable por el Administrador. Cada examen tiene: nombre, categoría, unidad de medida, valores referenciales por sexo y grupo etario.

---

## 9. OCR DEL DNI

El registro de paciente incluye dos vías para capturar datos automáticamente:

### Opción A — Cámara OCR (Tesseract.js)
1. El técnico presiona "Escanear DNI"
2. La cámara del celular se activa
3. Se captura foto del frente del DNI peruano
4. Tesseract.js extrae: N° DNI, apellidos, nombres, fecha de nacimiento, sexo
5. Los campos del formulario se autocompletan
6. El técnico puede corregir cualquier campo antes de guardar

### Opción B — Consulta RENIEC (simulada en Fase 1)
1. El técnico ingresa el número de DNI manualmente
2. Presiona "Consultar RENIEC"
3. En Fase 1: el sistema simula la respuesta con datos coherentes
4. En Fase 2: se conecta a API real (apis.net.pe o similar)
5. Un aviso visible indica: *"Consulta RENIEC — modo simulación"*

---

## 10. HOJA DE RESULTADOS

Documento oficial generado digitalmente que reemplaza la plantilla Word actual.

### Estructura del documento

**Encabezado**
- Logo MINSA / DIRIS Lima Este (placeholder en Fase 1)
- Nombre del establecimiento y dirección
- Título: LABORATORIO CLÍNICO — INFORME DE RESULTADOS

**Datos del paciente**
- Apellidos y nombres, DNI, fecha de nacimiento, edad, sexo
- Historia clínica N°, médico solicitante, diagnóstico presuntivo
- Fecha de la orden, fecha de resultado, código de muestra

**Tabla de resultados** (agrupada por categoría)

| Examen | Resultado | Unidad | Valor Referencial | Interpretación |
|---|---|---|---|---|
| Hemoglobina | 11.2 | g/dL | 12.0 – 16.0 | ▼ BAJO |
| Glucosa | 95 | mg/dL | 70 – 100 | NORMAL |

- Valores fuera de rango resaltados en rojo (alto) o azul (bajo)
- Resultados reactivos resaltados en rojo

**Pie del documento**
- Observaciones generales
- Nombre, firma y cargo de la técnica que valida
- Fecha y hora de emisión
- *"Documento generado digitalmente — para uso exclusivo de la historia clínica"*

### Formatos de salida
- **Impresión directa:** `window.print()` con CSS `@media print`, tamaño A4
- **Descarga PDF:** generado con jsPDF + html2canvas

---

## 11. DASHBOARD JEFE PROVINCIAL

Panel en tiempo real visible solo para el rol Jefe Provincial.

### KPIs principales (con selector: hoy / semana / mes)

| Indicador | Descripción |
|---|---|
| Total órdenes | Órdenes registradas en el período |
| Por estado | Distribución: pendientes / en proceso / completadas / emitidas |
| Total pruebas procesadas | Suma de exámenes individuales completados |
| Tiempo promedio | Horas entre registro de orden y emisión de resultado |
| Sede con mayor volumen | Ranking automático |
| Valores críticos | Cantidad de resultados fuera de rango en el período |

### Gráficos

- **Barras agrupadas:** pruebas por sede (comparativo entre establecimientos)
- **Barras simples:** top 10 exámenes más solicitados
- **Línea:** tendencia diaria de órdenes del mes en curso
- **Dona:** distribución por categoría de examen
- **Mapa de calor:** volumen por día de la semana × hora del día

### Tabla resumen por sede

| Sede | Órdenes hoy | Pendientes | En proceso | Completadas | Emitidas | % completado |
|---|---|---|---|---|---|---|
| Ricardo Palma | 24 | 3 | 5 | 14 | 12 | 83% |
| Matucana | 8 | 1 | 2 | 5 | 5 | 100% |
| ... | ... | ... | ... | ... | ... | ... |

---

## 12. REPORTES E INDICADORES

### Filtros disponibles
- Sede (una o todas)
- Rango de fechas
- Tipo / categoría de examen
- Estado de la orden
- Técnica / usuario responsable

### Reportes generables

| Reporte | Descripción |
|---|---|
| Libro de registros | Equivale al Excel actual — listado completo de órdenes |
| Producción por sede | Cantidad de pruebas por tipo, agrupado por sede |
| Tiempos de procesamiento | Horas entre cada estado por orden |
| Valores críticos | Listado de resultados fuera de rango con datos del paciente |
| Actividad por técnico | Órdenes y exámenes procesados por usuario |

### Formatos de exportación
- PDF (impresión vía CSS `@media print`)
- Tabla HTML copiable compatible con Excel

---

## 13. IDENTIDAD DE LA APLICACIÓN

| Elemento | Definición |
|---|---|
| **Nombre** | Vialys |
| **Tagline** | *Del análisis al resultado, sin perder el rastro* |
| **Color primario** | Azul marino `#1B3A6B` |
| **Color acento** | Teal `#0D9488` |
| **Normal** | Verde `#16A34A` |
| **Alterado / crítico** | Rojo `#DC2626` |
| **Pendiente** | Amarillo `#D97706` |
| **En proceso** | Azul `#2563EB` |
| **Neutro / fondo** | Gris `#F8FAFC` |
| **Tipografía** | Sans-serif limpia, mínimo 14px en móvil |
| **Ícono** | V estilizada — ruta con checkpoint final |

---

## 14. ESPECIFICACIONES TÉCNICAS

| Componente | Tecnología |
|---|---|
| Framework | React con hooks (useState, useReducer, useContext) |
| Estilos | Tailwind CSS |
| Gráficos | Recharts |
| OCR | Tesseract.js (CDN) |
| Generación PDF | jsPDF + html2canvas |
| Impresión | window.print() con CSS @media print |
| PWA | manifest.json + service-worker.js |
| Estado | En memoria (sin backend ni localStorage en Fase 1) |
| Idioma | Español |
| Navegadores objetivo | Chrome Mobile, Safari iOS, Edge |
| Resolución mínima | 375px (iPhone SE) |

---

## 15. USUARIOS DE PRUEBA (PRECARGADOS)

| Usuario | Roles asignados | Sede |
|---|---|---|
| Ana Torres | Recepción + Toma de muestra | Ricardo Palma |
| Luis Quispe | Procesamiento + Emisión | Ricardo Palma |
| María Ccori | Recepción + Toma + Procesamiento + Emisión | Matucana |
| Dr. Jorge Salinas | Jefe Provincial | Ricardo Palma |
| Admin Sistema | Administrador | Ricardo Palma |

El sistema incluye **20 órdenes de ejemplo** distribuidas entre sedes y estados, con resultados variados (incluyendo valores críticos fuera de rango) para que el dashboard y los reportes se vean completamente poblados al cargar.

---

## 16. ROADMAP FUTURO (FASE 2 EN ADELANTE)

| Fase | Funcionalidad |
|---|---|
| 2 | Integración real con API RENIEC |
| 2 | Backend persistente (base de datos real) |
| 2 | Autenticación segura con contraseñas |
| 3 | Módulo médico: solicitud digital de órdenes |
| 3 | Integración con historia clínica electrónica |
| 3 | Alertas automáticas por valores críticos (SMS / WhatsApp) |
| 4 | Gestión de reactivos e insumos por sede |
| 4 | Control de calidad interno del laboratorio |
| 4 | Integración con SIGA / HIS MINSA |

---

## 17. PROMPT DE CONSTRUCCIÓN

El siguiente prompt está listo para generar la aplicación Vialys completa en cualquier generador de código (Claude, Cursor, v0, etc.):

---

```
Construye Vialys, una aplicación web PWA (Progressive Web App) completa 
de gestión de laboratorio clínico para la Red de Salud de la provincia de 
Huarochirí (Perú), usando React con hooks y Tailwind CSS. La sede central 
es el Laboratorio del Centro de Salud Ricardo Palma.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PWA — DISEÑO MOBILE-FIRST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La app debe funcionar como PWA instalable en celular Android/iOS:
- manifest.json con nombre "Vialys", íconos y theme_color #1B3A6B
- service-worker.js con caché offline básico
- Viewport optimizado para 375px–430px (celular)
- Navegación inferior tipo tab-bar en móvil (no sidebar)
- Botones grandes (mínimo 48px alto), formularios tipo app nativa
- En escritorio se adapta a layout con sidebar lateral
- Cada módulo diseñado pensando primero en el uso con el pulgar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SISTEMA DE ROLES Y AUTENTICACIÓN (simulada)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Login simulado (sin backend): usuario selecciona su nombre y sede,
el sistema carga su perfil de roles. Un usuario puede tener múltiples
roles asignados simultáneamente.

ROLES DEL SISTEMA:
1. RECEPCIÓN / REGISTRO
   - Registrar nueva orden (digitalizar la Orden en papel)
   - Buscar paciente por DNI (con OCR)
   - Ver lista de órdenes del día de su sede
   - No puede ingresar resultados ni ver dashboard global

2. TOMA DE MUESTRA
   - Ver cola de pacientes con orden registrada y muestra pendiente
   - Marcar muestra como tomada (con hora, tipo de muestra, técnica)
   - Indicar si la muestra se procesa en la misma sede o se deriva
   - Imprimir/mostrar código de identificación de muestra
   - No puede ingresar resultados

3. PROCESAMIENTO / ANÁLISIS
   - Ver cola de muestras recibidas pendientes de procesar
   - Ingresar resultados por examen (valor, unidad, rango ref.)
   - Indicador automático NORMAL/ALTO/BAJO/REACTIVO
   - Registrar equipo utilizado y observaciones
   - No puede emitir el documento final

4. EMISIÓN DE RESULTADOS
   - Ver órdenes con resultados completos pendientes de emisión
   - Revisar y validar resultados antes de emitir
   - Generar hoja de resultados (PDF + impresión)
   - Marcar orden como ENTREGADA

5. JEFE PROVINCIAL
   - Dashboard en tiempo real de todas las sedes
   - Acceso de solo lectura a cualquier orden y resultado
   - Reportes e indicadores por sede, período y tipo de examen
   - No puede modificar registros

6. ADMINISTRADOR
   - Gestión de usuarios (nombre, rol/es asignados, sede)
   - Gestión de sedes (agregar, editar, activar/desactivar)
   - Catálogo de exámenes (agregar, editar valores referenciales)
   - Configuración general del sistema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OCR DNI — INTEGRACIÓN RENIEC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPCIÓN A — Cámara OCR (Tesseract.js):
- Botón "Escanear DNI" abre la cámara del celular
- Extrae: número de DNI, apellidos, nombres, fecha de nacimiento, sexo
- Muestra preview de la imagen capturada
- Permite corrección manual antes de confirmar

OPCIÓN B — Consulta RENIEC (simulada en Fase 1):
- Al ingresar el DNI manualmente, botón "Consultar RENIEC"
- Simula la respuesta con datos coherentes
- Mensaje visible: "Consulta RENIEC — modo simulación"
- Arquitectura preparada para API real en Fase 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLUJO Y ESTADOS DE LA ORDEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGISTRADA → MUESTRA TOMADA → EN PROCESO → 
RESULTADOS COMPLETOS → VALIDADO → EMITIDO

Cada cambio de estado registra: usuario, sede, fecha y hora.
El historial de estados es visible en el detalle de cada orden.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIOS MULTI-SEDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Al registrar la orden se indica:
- Sede que emite la orden
- Sede donde se toma la muestra
- Sede donde se procesa

La orden es visible para las sedes involucradas en cada paso.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEDES PRECARGADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- C.S. Ricardo Palma (SEDE CENTRAL)
- C.S. Matucana
- C.S. San Mateo
- C.S. Chicla
- C.S. Casapalca
- C.S. Surco
- C.S. Antioquía

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATÁLOGO DE EXÁMENES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hematología: Hemograma completo, Hematocrito, Hemoglobina,
  Grupo sanguíneo y Rh, Tiempo de coagulación, Tiempo de sangría,
  Recuento de plaquetas

Bioquímica: Glucosa, Urea, Creatinina, Ácido úrico, Colesterol total,
  Triglicéridos, HDL, LDL, TGO, TGP, Bilirrubinas (total/directa/
  indirecta), Proteínas totales, Albúmina

Microbiología: Cultivo de orina, Cultivo de heces, Cultivo de esputo,
  BK esputo (baciloscopia), Gram de secreción

Inmunología/Serología: RPR/VDRL, VIH (prueba rápida), HBsAg,
  Prueba de embarazo, PCR cualitativa, Widal

Uroanálisis/Coprológico: Examen completo de orina, Examen
  parasitológico de heces, Coprocultivo, Test de Graham

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÓDULO 1 — REGISTRO DE ORDEN (ROL: RECEPCIÓN)
Formulario mobile-first con OCR/RENIEC para datos del paciente,
selección de exámenes por categoría en acordeón táctil,
y campos de gestión multi-sede.

MÓDULO 2 — TOMA DE MUESTRA (ROL: TOMA DE MUESTRA)
Cola de pacientes con orden registrada. Registro de extracción
con tipo de muestra, hora, condición, código autogenerado
y opción de derivación.

MÓDULO 3 — PROCESAMIENTO (ROL: PROCESAMIENTO/ANÁLISIS)
Cola de muestras. Ingreso de resultados por examen con
badge automático NORMAL/ALTO/BAJO/REACTIVO. Guardado parcial.

MÓDULO 4 — EMISIÓN (ROL: EMISIÓN DE RESULTADOS)
Hoja de resultados con encabezado oficial MINSA, tabla por
categoría con valores críticos resaltados, firma de la técnica.
Botones PDF + imprimir. Confirmación de emisión.

MÓDULO 5 — DASHBOARD (ROL: JEFE PROVINCIAL)
KPIs en tiempo real, gráficos con Recharts (barras, línea, dona,
mapa de calor), tabla resumen por sede. Selector hoy/semana/mes.

MÓDULO 6 — REPORTES (ROL: JEFE PROVINCIAL)
Filtros por sede, fechas, tipo de examen, estado, técnico.
Libro de registros, producción, tiempos, valores críticos.
Exportar PDF y tabla copiable como Excel.

MÓDULO 7 — ADMINISTRACIÓN (ROL: ADMINISTRADOR)
Gestión de usuarios, sedes, catálogo de exámenes y log de actividad.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USUARIOS Y DATOS DE PRUEBA PRECARGADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usuarios:
- Ana Torres / Recepción + Toma de muestra / Ricardo Palma
- Luis Quispe / Procesamiento + Emisión / Ricardo Palma
- María Ccori / Recepción + Toma + Procesamiento + Emisión / Matucana
- Dr. Jorge Salinas / Jefe Provincial / Ricardo Palma
- Admin Sistema / Administrador / Ricardo Palma

20 órdenes de ejemplo distribuidas entre sedes y estados, con
resultados variados (algunos valores críticos) para dashboard poblado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDENTIDAD Y DISEÑO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

App: Vialys — "Del análisis al resultado, sin perder el rastro"
Azul marino #1B3A6B · Teal #0D9488 · Verde #16A34A · 
Rojo #DC2626 · Amarillo #D97706
Mobile: bottom tab-bar. Desktop: sidebar.
Toast notifications para feedback. 100% en español.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTAS TÉCNICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- React con hooks (useState, useReducer, useContext)
- Recharts para gráficos
- Tesseract.js (CDN) para OCR
- jsPDF + html2canvas para PDF
- window.print() con @media print para impresión
- Todo en memoria (sin backend ni localStorage)
- Código en un solo archivo .jsx
- Comentarios en español
```

---

*Documento elaborado con Claude — Anthropic · Mayo 2026*
*Vialys es un nombre propuesto para el sistema — sujeto a validación institucional*