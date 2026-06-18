# Guia de defensa oral - Fase 5

## Apertura

"En Fase 5 no agregamos IA como una moda, sino como una extension coherente con el negocio. El sistema ya tenia matchmaking, eventos, query service y datos operativos; por eso elegimos RAG para que la IA pueda recomendar partidos y turnos usando informacion real de la plataforma."

## Idea central

"La decision principal es separar la IA del core transaccional. Reservas, pagos y liberacion de turnos siguen funcionando aunque el proveedor LLM falle. La IA mejora la experiencia, pero no queda en el camino critico del negocio."

## Como funciona RAG

"Cada vez que cambia un turno, partido, cancha o torneo, el servicio de dominio publica un evento. Un worker consume ese evento, genera un embedding y actualiza una base vectorial. Cuando el usuario consulta en lenguaje natural, el asistente busca candidatos relevantes y recien ahi llama al LLM con contexto acotado."

## Como se manejan timeouts y costos

"Las llamadas LLM tienen timeout, circuit breaker, rate limiting y fallback. Para notificaciones, si la IA no responde rapido, enviamos una plantilla tradicional. Ademas medimos tokens, latencia, errores, tasa de fallback y costo por caso de uso."

## Cierre

"El resultado final es una arquitectura cloud-ready, Event-Driven y ahora AI-ready: incorpora IA sin comprometer consistencia, disponibilidad ni costos. Es una evolucion incremental, no una reescritura."

