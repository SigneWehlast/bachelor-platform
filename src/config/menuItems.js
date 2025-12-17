export const menuItems = [
  {
    label: "Generelt",
    children: [
      {
        label: "Login",
        path: "/login",
        view: () => import("@/views/LoginView.vue"),
        hidden: true,
        meta: { layout: "none", title: "Login - CarAds" }
      },
      {
        label: "Administration",
        path: "/administration",
        icon: "Cog",
        meta: { title: "Administration - CarAds"},
        view: () => import("@/views/AdministrationView.vue"),
        children: [
          {
            label: "Lead-view",
            path: "/lead-view",
            view: () => import("@/views/CarBoostView.vue"),
            section: "Carboost",
            iconAdministration: "ChartLine",
            LabelAdministration: "Håndter CarBoost-funtkioner",
            meta: { title: "CarBoost - CarAds"}
          },
          
          {
            label: "Kundedata",
            path: "/kundedata",
            view: () => import("@/views/SalesView.vue"),
            section: "Salg",
            iconAdministration: "AccountGroup",
            LabelAdministration: "Håndter salgs funktioner",
            meta: { title: "Salgvisning - CarAds" }
          },
            {
            label: "Indstillinger",
            path: "/diverse/notificationsettings",
            view: () => import("@/views/SettingsView.vue"),
            section: "Generelle indstillinger",
            iconAdministration: "Cog",
            LabelAdministration:"Håndter bruger indstillinger",
            meta: { title: "Indstillinger - CarAds"}
          },
        ]
      },
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: "ViewDashboardVariant",
        view: () => import("@/views/DashboardView.vue"),
        meta: { title: "Dashboard - CarAds"},
        children: [
          {
            label: "Kundeændringer",
            path: "/dashboard/customerchanges",
            view: () => import("@/views/CustomerChanges.vue"),
            meta: { title: "Kundeændringer - CarAds"}
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
            meta: { title: "Notifikationsindstillinger - CarAds"}
          },
        ]
      }
    ]
  }
]