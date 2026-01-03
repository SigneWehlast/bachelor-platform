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
        - dbConfig.js
    - controllers
        - authController.js
        - customerController.js
        - historyController.js
        - statsController.js
        - userController.js
    - cron
        - DailySync.js
    - middleware
        - authMiddleware.js
    - models
        - authModel.js
        - customerModel.js
        - historyModel.js
        - statsModel.js
        - userModel.js
    - routes
        - authRoutes.js
        - customerRoutes.js
        - historyRoutes.js
        - statsRoutes.js
        - userRoutes.js
    - scripts
        - SyncData.js
    - app.js
    - server.js
cypress
    - e2e
        - checkDataOnCustumers.cy.js
        - compareLeadsOnCustomers.cy.js
        - cypress.config.js
src
    - assets
        - styles
            - abstracts
                - _mixinss.scss
                - _variables.scss
            - base
                - _typograpy.scss
            - components
                    - dashboard
                        - _conversions-data-budget.scss
                        - _conversions-data-cars.scss
                        - _lates-customer-changes.scss
                        - _mdk-media-overview.scss
                    - filter
                        - _dropdown.scss
                        - _serach-bar.scss
                    - modals
                        - _confirmation-modal.scss
                        - _show-customer-car-boost-modal.scss
                    - navigation
                        - _breadcrumbs-comp.scss
                        - _nontification-bell.scss
                        - _ nontification-comp.scss
                - _base-table.scss
                - _car-boost-graph.scss
                - _car-boost-table.scss
                - _icon.scss
                - _nontification-settings-comp.scss
                - _sale-table.scss
                - _settings-navigation.scss
                - _tooltip.scss
            - layout
                - _navigation-comp.scss
            - pages
                - _administration-view.scss
                - _car-boost-view.scss
                - _custumer-changes.scss
                - _dashboard-view.scss
                - _login-view.scss
                - _nontification-settings.scss
                . _sales-view.scss
            _app.scss
            main.scss
    - components
        - dashboard
            - ConversionsDataBudget.vue
            - ConversionsDataCars.vue
            - LatestCustomerChanges.vue
            - LatesCustomerChangesContent.vue
        - filter
            - CalenderComp.vue
            - Dropdown.vue
            - ExportData.vue
            - SerarchBar.vue
        - modals
            - ConfirmationModal.vue
            - ShowCustomerCarBoostModal.vue
        - navigation
            - BreadcrumbsComp.vue
            - NavigationComp.vue
            - NontificationBell.vue
            - NontificationComp.vue
        - BaseTable.vue
        - CarboostGraph.vue
        - CarboostTable.vue
        - Icon.vue
        - NontificationSettingsComp.vue
        - SaleTable.vue
        Tooltip.vue
    - config
        - icons.js
        - menuItems.js
        tooltipData.josn
    - router
        - index.js
    - services
        - calenderService.js
        - carboostService.js
        - customerChangesService.js
        - customerServie.js
        - customerStatsService.js
        - groupOverviewService.js
        - historyServic.js
        - nontificationService.js
        - userService.js
    - utils
        - CarboostWarnings.js
        - dropdown.js
        filterNotifications.js
        findPath.js
        goBack.js
        pagination.js
        serarchFilter.js
        sort.js
        tracking.js
        trackingStore.js
    - views
        - AdministrationView.vue
        - CarBoostView.vue
        - CustomerChanges.vue
        - DashboardView.vue
        - LoginView.vue
        - NontificationSettings.vue
        - SalesView.vue
        - SettingsView.vue
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