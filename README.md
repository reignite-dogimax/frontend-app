# FrontendApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.5.

<<<<<<< HEAD
=======
## Arquitectura DDD (Domain-Driven Design)

El proyecto aplica DDD de forma consistente en el feature de notificaciones y sirve como plantilla para futuros features.

Capas y responsabilidades:
- Domain (src/app/<feature>/domain):
  - Entidades y tipos de dominio (p. ej., `notification.entity.ts`).
  - Abstracciones/contratos (p. ej., `notification.repository.ts` con `InjectionToken`).
- Application (src/app/<feature>/application):
  - Casos de uso orquestan lógica de aplicación sobre el dominio (p. ej., `list-notifications.usecase.ts`, `mark-as-read.usecase.ts`, etc.).
  - No conocen detalles de infraestructura.
- Infrastructure (src/app/<feature>/infrastructure):
  - Implementaciones concretas de los contratos de dominio (p. ej., `http-notification.repository.ts`).
  - Adaptadores/DTOs y mapeadores (`http/notification.dto.ts`, `mappers/notification.mapper.ts`).
- Presentation y State (src/app/<feature>/presentation y src/app/<feature>/state):
  - Componentes UI y stores que consumen únicamente casos de uso (no conocen la infraestructura ni acceden a HttpClient directo).

Inyección de dependencias:
- En `app.config.ts` se provee el repositorio de dominio a través del token `NOTIFICATION_REPOSITORY` con la implementación `HttpNotificationRepository`.
- Los casos de uso inyectan el repositorio vía token; los stores inyectan casos de uso.

Migración y deprecaciones:
- `notifications/data/notifications.service.ts` fue deprecado (reemplazado por casos de uso) para evitar duplicidades.
- `notifications/models/notification.model.ts` re-exporta el tipo del dominio y está marcado como deprecated. Usa `../domain/notification.entity` en su lugar.

Ejemplo de uso (store -> casos de uso):
- `notifications/state/notifications.store.ts` inyecta `ListNotificationsUseCase`, `MarkAsReadUseCase`, `MarkAllAsReadUseCase` y `RemoveNotificationUseCase` y expone señales para la UI.

>>>>>>> refs/heads/feature/gestión_de_notificaciones
## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

<<<<<<< HEAD
=======
Optional: fake API server

```bash
npm run server
```

>>>>>>> refs/heads/feature/gestión_de_notificaciones
## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

<<<<<<< HEAD
=======
Se incluye una prueba simple de mapeo DTO<->dominio en `notifications/infrastructure/mappers/notification.mapper.spec.ts`.

>>>>>>> refs/heads/feature/gestión_de_notificaciones
## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
