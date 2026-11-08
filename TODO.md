# Migración del front al back real

Pendientes de la migración de `json-server` (`localhost:3000`) a la API de Spring Boot
(`localhost:8080/api`). Rama: `feature/backend-integration`.

**Validar siempre con `ng build` desde `frontend/`, no con `tsc`.** Los errores de template
solo los detecta el compilador de Angular (`strictTemplates` está activado), y son varios.

Estado al cierre de la sesión del 2026-10-31: **36 errores de compilación**, concentrados
en 4 archivos. La capa de autenticación está completa.

---

## Hecho

- `core/api.config.ts` — `API_BASE_URL` como `InjectionToken` con `factory`.
- `core/auth-interceptor.ts` — prefija `/api`, agrega el `Bearer`, y ante un 401 limpia
  la sesión y redirige (salvo en las rutas públicas de auth y en `/auth/me`).
- `core/storage-key.ts` — las claves de localStorage en un solo lugar.
- `core/errors/` — `ProblemDetail`, `ValidatorError`, `GlobalError`.
- `model/account.ts`, `model/address.ts` — el contrato real, con `PROVINCES`.
- `auth/dto/login-response.ts`.
- `auth/service/auth-service.ts` — reescrito: `login()` contra `POST /auth/login`,
  `restoreSession()` contra `GET /auth/me`, `clearSession()` centralizado. Se fue la
  dependencia a `UserService` y el login falso que comparaba contraseñas en el navegador.
- `app.config.ts` — `provideAppInitializer` resolviendo la sesión antes del render.
- `auth/guards/auth-guard-guard.ts` — simplificado: sin `as any` y sin fallback a
  localStorage. El initializer garantiza que el estado ya es definitivo cuando corre.
- `pages/sign-in/sign-in.ts` — validadores del back, `returnUrl`, `messageFor()`
  mapeando 0/400/401/423, y el `trim()` de la contraseña eliminado.
- `app.routes.ts` — rutas sin el param `:id` decorativo; `seller-dash`, `cart` y
  `profile` fuera por ahora.
- `component/header/header.ts` — migrado a `Account`, `account$`, URLs fijas, `.uuid`,
  y el getter `displayName`.
- `home.ts`, `product-details.ts`, `user-profile.ts` — `userState$` → `account$`.

## A. Para llegar a cero errores

- [ ] **1.** `frontend/tsconfig.app.json` — agregar al `exclude`:
      `"src/app/pages/seller-dash/**"` y `"src/app/pages/cart/**"`.
      **Importante:** sacar la ruta y el import de `app.routes.ts` **no** alcanza.
      Ese tsconfig tiene `"include": ["src/**/*.ts"]`, así que compila todos los archivos
      de `src/` sin importar si el router los alcanza. El `exclude` es el único mecanismo
      de cuarentena real. Esto solo saca 23 de los 36 errores.
- [ ] **2.** `product-details.html:18,30` — quedaron en `currentUser?.isSeller` pero la
      propiedad del componente se renombró a `currentAccount` (`.ts:62`). Al corregirlo
      va a saltar el error de `isSeller`, que depende del punto 20.

Con 1 y 2 quedan solo los ~13 de `user-profile`, que son la Fase 1.

## B. Resto de la Fase 0 — registro

- [ ] **3.** `auth/dto/register-request.ts` — crear `RegisterRequest` y `AddressRequest`.
      Acá los opcionales van con `?` (se omiten del JSON), a diferencia de los de response
      que van con `| null` (llegan con valor `null`).
- [ ] **4.** `shared/address-form.ts` — función que devuelve el `FormGroup` de dirección.
      Lo necesitan registro **y** perfil: armarlo una sola vez. 10 campos, 4 obligatorios
      (`street`, `city`, `province`, `postalCode`), dropdown con `PROVINCES`, y
      `postalCode` con regex `^\d{4}$|^[A-Z]\d{4}[A-Z]{3}$`.
- [ ] **5.** `pages/user-form/user-form.ts` — rehacer el formulario contra
      `RegisterRequestDTO`:
      - `fullName` → `firstName` + `lastName`
      - `DNI` → `documentType` + `documentNumber`
      - `address` string → objeto
      - se van `username`, `nationality`, `isSeller` (no existen en el back)
      - `repassword` se queda (es solo del front)
      - validador cruzado: 8 dígitos para DNI, 11 para CUIT/CUIL
      - password: `minLength(8)`, `maxLength(64)` y
        `^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$`
- [ ] **6.** `user-form.ts` — `postUser` → `authService.register()`, inyectando
      `AuthService` en vez de `UserService`.
      **Trampa del 202:** un email ya registrado devuelve `202 ACCEPTED` con un
      `ProblemDetail` en el body. Angular trata todo 2xx como éxito, así que cae en
      `next`, no en `error`, y leer `.uuid` de ahí da `undefined`. Distinguirlo con
      `observe: 'response'`, pero **mostrar el mismo mensaje neutro en 201 y 202**:
      el back responde así a propósito para no revelar qué emails existen.
- [ ] **7.** Al mapear los `errors[]` de un 400: los campos anidados vienen con punto
      (`address.street`), así que hay que usar `form.get('address.street')`. Y hay un
      error que **no corresponde a ningún control**: la regla de longitud del documento
      llega con `field: "longDocumentValid"`, porque en el back es un `@AssertTrue` sobre
      un método. Si se mapea a ciegas, ese mensaje se pierde en silencio.
- [ ] **8.** `header.ts:13` — import de `User` sin usar.

## C. Fase 1 — usuario

- [ ] **9.** `service/user-service.ts:11` — pasar a rutas relativas para que el
      interceptor les ponga el prefijo: `GET /users/me`, `PATCH /users/{uuid}`,
      `DELETE /users/{uuid}`.
- [ ] **10.** `user-service.ts` — borrar `getUsers`, `getUserById` y `createUser`.
      Los dos primeros no tienen endpoint en el back; el registro ahora vive en auth.
- [ ] **11.** `pages/user-profile/user-profile.ts` — rehacer `patchForm` y el formulario
      contra `UserUpdateDTO`, que acepta **solo 4 campos**: `firstName`, `lastName`,
      `phoneNumber`, `address`. Se van `password`, `DNI`, `nationality`, `isSeller`.
      Son 13 de los 36 errores actuales. Reusar el grupo del punto 4.
- [ ] **12.** `app.routes.ts` — restaurar `/profile`, y recién ahí probar el guard y el
      `returnUrl`: hoy no hay ninguna página autenticada, así que esas dos piezas
      quedaron escritas pero sin verificar.
- [ ] **13.** `component/header/header.html:67-89` — descomentar la UI de sesión y
      migrarla. El getter `displayName` ya está hecho esperando.
      **Mientras siga comentada, el header no cambia al loguearse**: el `ng-template #end`
      está vacío. Verificar el login por Network y localStorage, no por pantalla.

## D. Código comentado para borrar

Git tiene el historial (`git log -p`). No hace falta guardarlo en el archivo.

- [ ] **14.** `auth/guards/auth-guard-guard.ts:15-31` — el bloque viejo con los `as any`.
- [ ] **15.** `pages/user-form/user-form.ts:170-187` — el `handleSubmit` anterior.
- [ ] **16.** `pages/user-profile/user-profile.ts:46,54-60,66,90` — el pipeline muerto del
      param `:id`. Se borra sin riesgo: `userResource` no se usaba en ningún lado y
      `getUserById` no tiene endpoint al que migrar.
- [ ] **17.** `pages/user-profile/user-profile.ts:62` — `userForm`, declarado y nunca usado.
- [ ] **18.** `app.routes.ts:16-19` — escribirle el motivo al bloque comentado.

## E. Fase 2 — bloqueado por el back

No es trabajo de front: es lo que falta o hay que decidir del otro lado.

- [ ] **19.** `isSeller` (6 usos en `seller-dash`, 2 en `product-details.html`, 1 en
      `header.html:72`) — **no existe rol de vendedor**: `RoleType` solo tiene `ROLE_USER`
      y `ROLE_ADMIN`. O lo agrega el back, o se deduce de otra cosa (tener productos
      creados). Mientras tanto, contenerlo en una función con el TODO. **No** agregar el
      campo a `Account`: sería mentirle al compilador, dejaría todos los `if` en `false`
      y ningún error explicaría por qué el dashboard quedó muerto.
- [ ] **20.** `seller-dash` — no hay endpoint de "mis productos".
      `ProductService.getAllCreated()` hace `findAll(spec, page)` sin filtrar por el
      usuario autenticado.
- [ ] **21.** `service/checkoutService.ts:12` — `/purchases` no existe en el back.
- [ ] **22.** `service/notification-service.ts:11` — las notificaciones no existen en el
      back. Se llama desde `header.ts` al loguearse: va a fallar en consola.
- [ ] **23.** `service/offer-service.ts:11` — `/api/offers` solo tiene **POST**.
      No hay listar, aceptar, rechazar ni contraofertar.
- [ ] **24.** `service/product.ts:11` — `localhost:3000` → `/products`.
      Esta sí tiene back completo: es la próxima feature migrable después de usuario.
      Ojo con el envelope `Page<T>` de Spring Data (`content`, `totalElements`, …) en
      lugar de un array pelado.

## F. Hallazgos del back (repo `loki-thesis-back`)

- [ ] **25.** **IDOR:** `PATCH` y `DELETE /api/users/{uuid}` no reciben el
      `@AuthenticationPrincipal` ni validan que el uuid sea del usuario autenticado.
      Cualquier usuario logueado puede editar o borrar otra cuenta cambiando el UUID
      de la URL.
- [ ] **26.** **DNI:** el mensaje del `@AssertTrue` dice "7 u 8 dígitos" pero el código
      exige `longitud == 8`. Un DNI de 7 dígitos se rechaza con un mensaje que afirma que
      es válido. Decidir si el bug es el mensaje o la condición.
- [ ] **27.** **500 en el listado público:** `Product.getCoverImage()` hace
      `orElseThrow(EntityNotFoundException)` si ningún `ProductImage` tiene
      `displayOrder == 1`, y `getAllPublished` mapea todos los productos por ahí.
      Un solo producto publicado sin imagen rompe el listado entero.
- [ ] **28.** `coverImageUrl` devuelve el `publicId` de Cloudinary, no una URL. No sirve
      para un `<img src>` tal cual. Debería devolver el `secureUrl`: el front no tendría
      por qué saber cómo se arman las URLs de Cloudinary.
- [ ] **29.** `CORS_ALLOWED_ORIGINS` está vacío en `.env.example`. Sin valor Spring no
      arranca (placeholder sin resolver); sin `http://localhost:4200` todos los requests
      del front fallan con `status 0`. Spring Boot no lee `.env` solo: la variable tiene
      que estar en la config de ejecución del IDE o exportada en la terminal.
- [ ] **30.** Falta `.claude` en el `.gitignore` de ese repo.

---

## Notas de contrato

Verificado contra el back. Para no volver a deducirlo.

- **`account.uuid` es el uuid del `User`**, no del `Credential` (`AuthMapper` mapea
  `user.uuid` → `uuid`). Sirve tal cual para `PATCH /users/{uuid}` y `/carts/{userCode}`.
- **El email no hace falta verificarlo para entrar.** `Credential.isEnabled()` mira
  `status == ACTIVE`, y `User.status` arranca en `ACTIVE`. `emailVerified` es informativo.
- **El login falla con 3 códigos**: 400 (validación), 401 (credenciales) y 423 (bloqueo
  de 15 minutos a los 3 intentos fallidos). El 403 de email no verificado existe pero el
  login no lo lanza.
- **Todo `/api/users` requiere token.** Lo único público son los 6 POST de auth,
  `GET /api/products/**` y `GET /api/categories`.
- **La base se borra en cada arranque** (`ddl-auto=create-drop`, decisión tomada). Hay que
  recrear el usuario en cada reinicio hasta que el registro funcione.
- **No trimear la contraseña.** El registro la manda tal cual y el login la trimeaba: una
  contraseña con espacios al borde dejaba la cuenta inaccesible para siempre. Si hay que
  prohibir espacios, va un validador `^\S+$` en el registro (y en el back), no un `trim()`
  en el login.

## Crear un usuario de prueba

El formulario de registro todavía no está migrado y la base se borra en cada arranque:

```
curl -i -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Lucas","lastName":"Camino","email":"lucas@test.com","password":"Prueba123!","documentType":"DNI","documentNumber":"40123456","phoneNumber":"+54 11 5555-5555","address":{"street":"Av. Corrientes","streetNumber":"1234","city":"CABA","province":"CABA","postalCode":"1043"}}'
```

Cada valor está elegido para pasar los validadores: password con mayúscula, dígito y
carácter especial; documento de 8 dígitos exactos; provincia del enum tal cual; código
postal de 4 dígitos. Espera un **201**. Un **202** significa que ese email ya existe.

```
curl -i -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"lucas@test.com","password":"Prueba123!"}'
```

Probar primero por curl y después por el navegador: si anda por curl y falla en el
browser, el problema es CORS o el front. Si falla por curl, es el back.

## Verificación del login en el navegador

1. `POST /api/auth/login` → 200, con `token`, `expiresAt` y `account` en el body.
2. La URL del request es `http://localhost:8080/api/auth/login`. Esto prueba que el
   interceptor prefija bien, que es la pieza que nunca se pudo verificar.
3. Local Storage con `auth_token` y `expires_at`.
4. **Recargar la página** → sale un `GET /api/auth/me` con 200 y el header
   `Authorization: Bearer ...`. Este es el único paso que verifica la máquina completa:
   `provideAppInitializer` + `restoreSession` + interceptor.

Pendiente de confirmar en el primer login: que `createdAt` y `expiresAt` lleguen como
strings ISO y no como números, y que los campos opcionales de dirección lleguen como
`null` y no ausentes (de eso depende si van con `| null` o con `?`).
