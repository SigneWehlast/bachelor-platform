export const menuItems = [
  {
    label: "Generelt",
    children: [
      {
        label: "Login",
        path: "/",
        view: () => import("@/views/LoginView.vue"),
      },
      {
        label: "Administration",
        path: "/administration",
        icon: "Cog",
        view: () => import("@/views/AdministrationView.vue"),
        children: [
          {
            label: "Lead-view",
            path: "/carboost",
            view: () => import("@/views/CarBoostView.vue"),
          },
          {
            label: "Kundedata",
            path: "/sales",
            view: () => import("@/views/SalesView.vue"),
          },
          {
            label: "Indstillinger",
            path: "/nontificationsettings",
            view: () => import("@/views/NotificationSettings.vue"),
          },
        ],
      },
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: "ViewDashboardVariant",
        view: () => import("@/views/DashboardView.vue"),
        children: [
          {
            label: "Kundeændringer",
            path: "/customerchanges",
            view: () => import("@/views/CustomerChanges.vue"),
          },
        ],
      },
    ],
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
        children: [
            {
            label: "Bruger indstillnger",
            path: "",
          },
          {
            label: "Notifikationsindstillinger",
            path: "/nontificationsettings",
            view: () => import("@/views/NotificationSettings.vue"),
          },

        ]
      }
    ]
  }
]
