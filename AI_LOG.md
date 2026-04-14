# AI_LOG.md

## Ús de la IA

En aquest projecte s’han utilitzat eines d’intel·ligència artificial com a suport puntual per resoldre dubtes, generar propostes de codi i revisar implementacions. En tots els casos, el resultat s’ha
revisat, adaptat i validat manualment abans d’incorporar-lo al projecte.

---

## Registre de consultes

### Consulta 1

**Eina:** ChatGPT  
**Model:** GPT-5.4 Thinking

**Pregunta**  
Validació de interface Review

**Prompt** Et sembla correcte q per fer un model de ressenyes li passi userId: string; routeId: string; title: string; comment?: string;ratings: { label: string; score: number; }[];

**Incoherències**  
Encaixava tot

**Solució**  
Que ho he pensat bé

---

### Consulta 2

**Eina:** ChatGPT  
**Model:** GPT-5.4 Thinking

**Pregunta**  
Comentaris SWAGGER en el routes/Reviwe.ts

**Prompt** router.get('/', controller.readAll); router.get('/:reviewId', controller.readReview); router.post('/', ValidateJoi(Schemas.Review.create), controller.createReview); router.put('/:reviewId',
ValidateJoi(Schemas.Review.update), controller.updateReview); router.delete('/:reviewId', controller.deleteReview); Em pots ajudar a fer els comentaris per visualitzar-lo al swagger seguint aquest
format: /\*\*

- @openapi
- tags:
-   - name: routes
-     description: CRUD endpoints for Routes
-
- components:
- schemas:
-     Route:
-       type: object
-       properties:
-         _id:
-           type: string
-           example: "65f1c2a1b2c3d4e5f6789012"
-         name:
-           type: string
-           example: "Ruta por Montserrat"
-         description:
-           type: string
-           example: "Ruta circular con vistas muy buenas"
-         city:
-           type: string
-           example: "Barcelona"
-         country:
-           type: string
-           example: "España"
-         distance:
-           type: number
-           example: 12.5
-         duration:
-           type: number
-           example: 180
-         difficulty:
-           type: string
-           example: "medium"
-         tags:
-           type: array
-           items:
-             type: string
-           example: ["montaña", "naturaleza"]
-         userId:
-           type: string
-           example: "65f1c2a1b2c3d4e5f6789001"
-         createdAt:
-           type: string
-           format: date-time
-           example: "2026-03-13T09:00:00.000Z"
-         updatedAt:
-           type: string
-           format: date-time
-           example: "2026-03-13T09:30:00.000Z"
-
-     RouteCreate:
-       type: object
-       required:
-         - name
-         - description
-         - city
-         - country
-         - distance
-         - duration
-         - difficulty
-       properties:
-         name:
-           type: string
-           example: "Ruta por Montserrat"
-         description:
-           type: string
-           example: "Ruta circular con vistas muy buenas"
-         city:
-           type: string
-           example: "Barcelona"
-         country:
-           type: string
-           example: "España"
-         distance:
-           type: number
-           example: 12.5
-         duration:
-           type: number
-           example: 180
-         difficulty:
-           type: string
-           enum: [easy, medium, hard]
-           example: "medium"
-         tags:
-           type: array
-           items:
-             type: string
-           example: ["montaña", "naturaleza"]
-
-     RouteUpdate:
-       type: object
-       properties:
-         name:
-           type: string
-           example: "Ruta por Montserrat"
-         description:
-           type: string
-           example: "Ruta circular con vistas muy buenas"
-         city:
-           type: string
-           example: "Barcelona"
-         country:
-           type: string
-           example: "España"
-         distance:
-           type: number
-           example: 12.5
-         duration:
-           type: number
-           example: 180
-         difficulty:
-           type: string
-           enum: [easy, medium, hard]
-           example: "hard"
-         tags:
-           type: array
-           items:
-             type: string
-           example: ["montaña", "naturaleza"]
    \*/

/\*\*

- @openapi
- /routes:
- get:
-     summary: List all Routes
-     tags: [routes]
-     security:
-       - bearerAuth: []
-     parameters:
-       - in: query
-         name: limit
-         required: false
-         schema:
-           type: integer
-           enum: [10, 25, 50]
-         description: Page size. Use together with page to enable pagination.
-       - in: query
-         name: page
-         required: false
-         schema:
-           type: integer
-           minimum: 1
-         description: Page number. Use together with limit to enable pagination.
-     responses:
-       200:
-         description: OK. If limit and page are omitted, returns the full list.
-       401:
-         description: Unauthorized
    \*/ router.get('/', controller.readAll);

/\*\*

- @openapi
- /routes/{routeId}:
- get:
-     summary: Get a Route by ID
-     tags: [routes]
-     security:
-       - bearerAuth: []
-     parameters:
-       - in: path
-         name: routeId
-         required: true
-         schema:
-           type: string
-         description: Route ObjectId
-     responses:
-       200:
-         description: OK
-       404:
-         description: Not found
-       401:
-         description: Unauthorized
    \*/ router.get('/:routeId', controller.readRoute);

/\*\*

- @openapi
- /routes:
- post:
-     summary: Create a Route
-     tags: [routes]
-     security:
-       - bearerAuth: []
-     requestBody:
-       required: true
-       content:
-         application/json:
-           schema:
-             $ref: '#/components/schemas/RouteCreate'
-     responses:
-       201:
-         description: Created
-       422:
-         description: Validation failed (Joi)
-       401:
-         description: Unauthorized
    \*/ router.post('/', ValidateJoi(Schemas.Route.create), controller.createRoute);

/\*\*

- @openapi
- /routes/{routeId}:
- put:
-     summary: Update a Route by ID
-     tags: [routes]
-     security:
-       - bearerAuth: []
-     parameters:
-       - in: path
-         name: routeId
-         required: true
-         schema:
-           type: string
-         description: Route ObjectId
-     requestBody:
-       required: true
-       content:
-         application/json:
-           schema:
-             $ref: '#/components/schemas/RouteUpdate'
-     responses:
-       200:
-         description: Updated
-       404:
-         description: Not found
-       422:
-         description: Validation failed (Joi)
-       401:
-         description: Unauthorized
-       403:
-         description: Forbidden
    \*/ router.put('/:routeId', ValidateJoi(Schemas.Route.update), controller.updateRoute);

/\*\*

- @openapi
- /routes/{routeId}:
- delete:
-     summary: Delete a Route by ID
-     tags: [routes]
-     security:
-       - bearerAuth: []
-     parameters:
-       - in: path
-         name: routeId
-         required: true
-         schema:
-           type: string
-         description: Route ObjectId
-     responses:
-       200:
-         description: OK
-       404:
-         description: Not found
-       401:
-         description: Unauthorized
-       403:
-         description: Forbidden
    \*/ router.delete('/:routeId', controller.deleteRoute);

> [Text literal que has enviat a l’assistent.]

**Incoherències**  
Algunes queries no encaixaven amb el model. No agafava bé les rutes.

**Solució**  
Canviar a mà les rutes q no encaixaven amb el codi fet

---

### Consulta 3

**Eina:** ChatGPT  
**Model:** GPT-5.4 Thinking

**Pregunta**  
Càlcul i visualització de les valoracions associades a les rutes des del backend

**Prompt** Diga'm com puc fer el calcul de la mitja de les ressenyes (la mitja de la nota numèrica)

**Incoherències**  
RouteId diferent escrit

**Solució**  
He canviat el com escriure el routeId del q m'ha donat la IA per q quadri amb el meu codi
