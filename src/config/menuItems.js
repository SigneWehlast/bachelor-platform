export const menuItems = [
  {
    label: "Generelt",
    children: [
      {
        label: "Login",
        path: "/",
        view: () => import("@/views/LoginView.vue"),
        hidden: true
      },
      {
        label: "Administration",
        path: "/Administration",
        icon: "Cog",
        view: () => import("@/views/AdministrationView.vue"),
        children: [
          {
            label: "Lead-view",
            path: "/Carboost/Lead-view",
            view: () => import("@/views/CarBoostView.vue")
          },
          {
            label: "Kundedata",
            path: "/Salg/Kundedata",
            view: () => import("@/views/SalesView.vue"),
          },
            {
            label: "Indstillinger",
             path: "/Diverse/Notificationsettings",
            view: () => import("@/views/SettingsView.vue"),
          },
        ]
      },
      {
        label: "Dashboard",
        path: "/Dashboard",
        icon: "ViewDashboardVariant",
        view: () => import("@/views/DashboardView.vue"),
        children: [
          {
            label: "Kundeændringer",
            path: "/Dashboard/Customerchanges",
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
        path: "/Diverse",
        view: () => import("@/views/SettingsView.vue"),
        children: [
          {
            label: "Notifikationsindstillinger",
            path: "/Notificationsettings",
            view: () => import("@/views/NotificationSettings.vue"),
          },
        ]
      }
    ]
  }
]
