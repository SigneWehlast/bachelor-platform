export const menuItems = [
  {
    label: "Generelt",
    children: [
      {
        label: "Login",
        path: "/",
        view: () => import("@/views/LoginView.vue"),
        hidden: true,
        meta: { layout: "none" }
      },
      {
        label: "Administration",
        path: "/Administration",
        icon: "Cog",
        view: () => import("@/views/AdministrationView.vue"),
        children: [
          {
            label: "Lead-view",
            path: "/Lead-view",
            view: () => import("@/views/CarBoostView.vue"),
            section: "Carboost"
          },
          
          {
            label: "Kundedata",
            path: "/Kundedata",
            view: () => import("@/views/SalesView.vue"),
            section: "Salg"
          },
            {
            label: "Indstillinger",
            path: "/Diverse/Notificationsettings",
            view: () => import("@/views/SettingsView.vue"),
            section: "Indstillinger"
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
