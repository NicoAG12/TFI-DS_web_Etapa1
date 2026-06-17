# Estado de la rama

## Situacion detectada inicialmente

La rama actual es `Etapa-3`.

Al revisar el estado del repositorio, `Etapa-3` estaba en el mismo commit que `main` y que `origin/Etapa-3`:

```text
f55351d Etapa2 modfi paso 1 y 2
```

Eso significa que, antes de recuperar el stash y agregar esta carpeta, no habia cambios propios de Etapa 3 versionados en el working tree.

## Cambios recuperados desde stash

Se encontro un stash reciente:

```text
stash@{0}: On staging: !!GitHub_Desktop<staging>
```

Ese stash contenia archivos generados de Fase 3 bajo `output/`, principalmente:

- Audios.
- Diagramas.
- Documentos `.docx`.
- PDFs renderizados.
- Imagenes de paginas renderizadas.

Se aplico el stash y luego se reorganizaron esos archivos dentro de:

```text
Etapa3/entregables/
```

El stash no fue eliminado; se uso `git stash apply`, por lo que queda disponible como respaldo.

## Decision tomada

Para que la rama tenga una contribucion clara y mergeable, se agrego la carpeta `Etapa3/` con documentacion separada por tema.

No se modifico codigo de la aplicacion. El objetivo es que esta rama funcione como entrega documental y pueda integrarse manualmente a `main` sin conflictos con la implementacion.

## Base tecnica documentada

La documentacion toma como referencia principal la estructura existente en:

```text
Etapa2-pasoB/apps/
```

Esa carpeta contiene la version mas avanzada del trabajo, con:

- `api-gateway`
- `auth-service`
- `core-service`
- `ventas-service`
- `torneos-service`
- `matchmaking-service`
- `query-service`
- `saga-orchestrator`

## Alcance de esta rama

Incluye:

- Documentacion de arquitectura.
- Separacion de servicios.
- Eventos publicados por dominio.
- Sagas identificadas.
- CQRS/proyecciones.
- Guia de integracion manual con `main`.
- Mensaje sugerido para responder sobre el estado de Git.
- Entregables recuperados desde stash y ordenados por carpeta.

No incluye:

- Refactor de codigo.
- Cambios en endpoints.
- Cambios en entidades o DTOs.
- Configuracion real de broker.
- Docker Compose o infraestructura de despliegue.
