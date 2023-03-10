import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

import Content from '@/components/Content/index';
import Header from '@/components/Header/index';
import Footer from '@/components/Footer/AccountFooter';
import Sidebar from '@/components/Sidebar/index';
import menu from '@/config/menu/index';
import { useWorkspace } from '@/providers/workspace';

const AccountLayout = ({ children, footer }) => {
  const { status } = useSession();
  const router = useRouter();
  const { workspace } = useWorkspace();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') return <></>;
  return (
    <>
      <main className="relative flex flex-col w-full space-x-0 text-gray-800 dark:text-gray-200 md:space-x-5 md:flex-row bg-gray-50 dark:bg-gray-800">
        <Sidebar menu={menu(workspace?.slug)} />
        <Content>
          <Toaster position="bottom-left" toastOptions={{ duration: 10000 }} />
          {children}
        </Content>
      </main>
    </>
  );
};

export default AccountLayout;
