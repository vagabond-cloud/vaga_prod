import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Actions from './actions';
import Menu from './menu';
import sidebarMenu from '@/config/menu/sidebar-static';
import { useWorkspaces } from '@/hooks/data';
import { useWorkspace } from '@/providers/workspace';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

const staticMenu = sidebarMenu();

const Sidebar = ({ menu }) => {
  const [showMenu, setMenuVisibility] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const { data, isLoading } = useWorkspaces();
  const { workspace } = useWorkspace();

  const router = useRouter();
  const { workspaceSlug, id } = router.query;

  const renderMenu = () => {
    return (
      workspaceSlug &&
      menu.map((item, index) => (
        <Menu
          key={index}
          data={item}
          isLoading={isLoading}
          showMenu={data?.workspaces.length > 0 || isLoading}
        />
      ))
    );
  };

  const renderStaticMenu = () => {
    return staticMenu.map((item, index) => (
      <Menu key={index} data={item} showMenu={true} />
    ));
  };

  const toggleMenu = () => setMenuVisibility(!showMenu);

  return (
    <aside className="sticky min-h-[100vh] z-40 flex flex-col space-y-5 text-white bg-gray-800 dark:bg-gray-900 md:overflow-y-auto md:w-1/5 overscroll-contain">
      <div className="relative flex items-center justify-center p-5 text-center border-b border-b-gray-900">
        <Link href="/" className="flex-grow text-2xl font-bold justify-center flex">
          <Image src="/android-chrome-192x192.png" width={48} height={48} alt="Vagabond Logo" />

        </Link>
        <button className="absolute right-0 p-5 md:hidden" onClick={toggleMenu}>
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      <div
        className={[
          'flex-col space-y-5 md:flex md:relative md:top-0',
          showMenu
            ? 'absolute top-12 bg-gray-800 right-0 left-0 h-screen'
            : 'hidden',
        ].join(' ')}
      >
        <Actions />
        <div className="flex flex-col p-5 space-y-10">
          {renderStaticMenu()}
          {renderMenu()}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
