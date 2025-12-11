export const menuItems = [
  {
    label: "Generelt",
    children: [
      {
        label: "Login",
        path: "/login",
        view: () => import("@/views/LoginView.vue"),
        hidden: true,
        meta: { layout: "none" }
      },
      {
        label: "Administration",
        path: "/administration",
        icon: "Cog",
        view: () => import("@/views/AdministrationView.vue"),
        children: [
          {
            label: "Lead-view",
            path: "/lead-view",
            view: () => import("@/views/CarBoostView.vue"),
            section: "Carboost",
            iconAdministration: "ChartLine",
            LabelAdministration: "Håndter CarBoost-funtkioner"
          },
          
          {
            label: "Kundedata",
            path: "/kundedata",
            view: () => import("@/views/SalesView.vue"),
            section: "Salg",
            iconAdministration: "AccountGroup",
            LabelAdministration: "Håndter salgs funktioner"
          },
            {
            label: "indstillinger",
            path: "/diverse/notificationsettings",
            view: () => import("@/views/SettingsView.vue"),
            section: "Generelle indstillinger",
            iconAdministration: "Cog",
            LabelAdministration:"Håndter bruger indstillinger"
          },
        ]
      },
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: "ViewDashboardVariant",
        view: () => import("@/views/DashboardView.vue"),
        children: [
          {
            label: "Kundeændringer",
            path: "/dashboard/customerchanges",
            view: () => import("@/views/CustomerChanges.vue"),
          },
        ]
      }
    ]
  },
  {
    label: "Produkter",
  },
  {
    label: "Indstillinger",
    children: [
      {
        label: "Diverse",
        icon: "AccountDetails",
        path: "/diverse",
        view: () => import("@/views/SettingsView.vue"),
        children: [
          {
            label: "Notifikationsindstillinger",
            path: "/notificationsettings",
            view: () => import("@/views/NotificationSettings.vue"),
          },
        ]
      }
    ]
  }
]
