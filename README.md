# bachelor-platform
Dette bachelorprojekt er udarbejdet for CarAds, hvor der er videreudviklet på deres interne platform.

## Funktioner på platformern
- Log ind
- Se notifikationer
- Se dashboard
    - Se seneste kundeændringer
    - Få oversigt over antal af kunder i grupper
    - Filtrere konverteringsdata på budget og biler
- Carboost - se, overvåge, sammenligne, filtrere og gemme data på kunder
- Salg - se, overvåge, filtrere, sammenligne, anonymisere og gemme data på kunder
- Notifikationsindstillinger
    - Fra/tilvælg notifikationer på nye kunder, faldende leads og stigende leads

## Installation
For at installere bachelor-platform:

1. Klon repository: https://github.com/SigneWehlast/bachelor-platform
2. Gå ind i filen: 'cd bachelor-platform'
3. Installer med 'npm install'
4. Installer dependencies
5. Kør i developer mode: 'npm run dev'

Ekstra:
- npm run start // starter express server så data kan blive vist i frontend
- npm run cron // synkroniser nyt data ind

## Development
Til udvikling på bachelor-platform:

1. Lav en kopi af bachelor-platform
2. Lav en ny branch
3. Lav ændringer
4. Test dine ændringer (fx via unit test)
5. Commit ændringerne (med en beskrivende commitbesked)
6. Push ændringerne
7. Send pull request

## Teknologier og værktøjer
- ApexCharts (npm install apexcharts)
- Axios (npm install axios)
- Cors (npm install cors)
- Cypress (npm install -D cypress)
- Dotenv (npm install dotenv)
- ESLint (npm install @eslint/config@latest)
- Express (npm install express)
- Jsonwebtoken (npm install jsonwebtoken)
- MySQL2 (npm install mysql2)
- Sass (npm install -D sass)
- Vitest (npm install -D vitest)
- Vue.js (npm install vue@latest)

## Opbygning af projekt
.github
    - workflows
        - deploy.yml
backend
    - config
    - controllers
    - cron
    - middleware
    - models
    - routes
    - scripts
    - app.js
    - server.js
cypress
src
    - assets
    - components
    - config
    - router
    - services
    - utils
    - views
    - App.vue
    - main.js
tests
    - unit
        - components
        - views
.env
.gitignore
index.html
package.json
README.md

## URL
https://bach.carads.io/#/

## developer team
Kasper Hjernø Nielsen & Signe Schwartz Wehlast