import { AdjustmentsVerticalIcon, CreditCardIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const sidebarMenu = () => [
  {
    name: 'Account',
    menuItems: [
      {
        name: 'Dashboard',
        path: `/account`,
        icon: AdjustmentsVerticalIcon,
      },
      {
        name: 'Billing',
        path: `/account/billing`,
        icon: CreditCardIcon,
      },
      {
        name: 'Settings',
        path: `/account/settings`,
        icon: Cog6ToothIcon,
      },
    ],
  },
];

export default sidebarMenu;
