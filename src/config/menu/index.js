import { HomeIcon, SquaresPlusIcon, GlobeAltIcon, UsersIcon, FolderMinusIcon } from "@heroicons/react/24/outline";
const menu = (workspaceId) => [
  {
    name: 'Workspace',
    menuItems: [
      {
        name: 'Home',
        path: `/account/${workspaceId}`,
        icon: HomeIcon
      },
      {
        name: 'Integrations',
        path: `/account/${workspaceId}/integrations`,
        icon: SquaresPlusIcon

      },
    ],
  },
  {
    name: 'Settings',
    menuItems: [

      {
        name: 'Domain Configurations',
        path: `/account/${workspaceId}/settings/domain`,
        icon: GlobeAltIcon

      },
      {
        name: 'Team Management',
        path: `/account/${workspaceId}/settings/team`,
        icon: UsersIcon

      },
      {
        name: 'Advanced',
        path: `/account/${workspaceId}/settings/advanced`,
        icon: FolderMinusIcon

      },
    ],
  },
];

export default menu;
