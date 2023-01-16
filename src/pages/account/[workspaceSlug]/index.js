import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import Reload from '@/components/Reload';
import TabsController from '@/components/Tabs';
import { createNew, learnMore, vagachain } from '@/config/workspace-overview/items';
import { AccountLayout } from '@/layouts/index';
import { log } from '@/lib/client/log';
import { getModules } from '@/prisma/services/modules';
import { getActivities } from '@/prisma/services/user';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { useWorkspace } from '@/providers/workspace';
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import General from './settings/general';
import Link from 'next/link'
import { types } from '@/config/workspace-overview/module-types'
import { activitydetails } from '@/config/activity'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Workspace = ({ activity, isTeamOwner, modules }) => {
  const router = useRouter();
  const { workspaceSlug, section } = router.query;
  let { workspace } = useWorkspace();

  const tabs = [
    { name: 'Workspace', href: `/account/${workspaceSlug}?section=workspace`, current: section === "workspace" || !section ? true : false },
    { name: 'Activity', href: `/account/${workspaceSlug}?section=activity`, current: section === "activity" ? true : false },
    { name: 'Settings', href: `/account/${workspaceSlug}?section=settings`, current: section === "settings" ? true : false },
  ]

  return (
    workspace ? (
      <AccountLayout>
        <Meta title={`Vagabond - ${workspace.name} | Dashboard`} />
        <Content.Title
          title={workspace.name}
          subtitle="This is your project's workspace"
        />
        <Content.Divider />
        <Content.Container>
          <TabsController tabs={tabs} />
          {section === "workspace" &&
            <Main workspace={workspace} modules={modules} />
          }
          {section === "activity" &&
            <Activity activity={activity} />
          }
          {section === "settings" &&
            <Settings workspace={workspace} isTeamOwner={isTeamOwner} />
          }
          {!section &&
            <Main workspace={workspace} modules={modules} />
          }
        </Content.Container>
      </AccountLayout >

    ) : (
      <Reload />
    )
  );
};

export default Workspace;



const Main = ({ workspace, modules }) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;


  return (
    <>
      <Card>
        <Card.Body
          title="My Workspace"
          subtitle="Building on Vagabond allows you to fully control your Workspace and Apps. To get more full access subscribe a plan."
          className="grid grid-cols-2 gap-4 h-80 bg-white rounded-lg shadow-lg">

          <div className="h-10" />
          <div className="px-4 grid grid-cols-2 gap-4 col-span-2">
            <div className="grid grid-cols-4 gap-4 col-span-2">
              <div className="col-span-1 bg-workspace-box bg-cover bg-center rounded-lg  h-40 relative ">
                <div className="h-full bg-gray-800/90  p-6 rounded-lg">
                  <p className="text-xs text-gray-300 justify-end flex absolute inset-x-0 bottom-4 p-4 font-bold">Workspace ID</p>
                  <p className="text-xs text-gray-300 justify-end flex absolute inset-x-0 bottom-0 p-4 ">{workspace.id}</p>
                </div>
              </div>
              <div className="col-span-1 bg-workspace-code bg-cover bg-center rounded-lg  h-40 relative ">
                <div className="h-full bg-gray-800/90 p-6 rounded-lg">
                  <p className="text-xs text-gray-300 justify-end flex absolute inset-x-0 bottom-4 p-4 font-bold">Workspace Code</p>
                  <p className="text-xs text-gray-300 justify-end flex absolute inset-x-0 bottom-0 p-4 ">{workspace.workspaceCode}</p>
                </div>
              </div>
              <div className="col-span-1 bg-workspace-name bg-cover bg-center rounded-lg  h-40 relative ">
                <div className="h-full bg-gray-800/90 p-6 rounded-lg">
                  <p className="text-xs text-gray-300 justify-end flex absolute inset-x-0 bottom-4 p-4 font-bold">Workspace Name</p>
                  <p className="text-xs text-gray-300 justify-end flex absolute inset-x-0 bottom-0 p-4 ">{workspace.name}</p>
                </div>
              </div>
              <div className="col-span-1 bg-workspace-date bg-cover bg-center rounded-lg  h-40 relative ">
                <div className="h-full bg-gray-800/90 p-6 rounded-lg">
                  <p className="text-xs text-gray-300 justify-end flex absolute inset-x-0 bottom-4 p-4 font-bold">Create Date</p>
                  <p className="text-xs text-gray-300 justify-end flex absolute inset-x-0 bottom-0 p-4 ">{moment(workspace.createdAt).format("DD/MM/YYYY")}</p>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <div className="py-10">
        <Modules modules={modules} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="my-6">
          <p className="text-md mb-4">Create something new</p>
          {createNew.map((item, index) => (
            <Link href={`/account/${workspaceSlug}/${item.link}`} key={index} className="" alt="">
              <div className="flex cursor-pointer my-4">
                <div className="w-10 h-10 rounded-lg border flex items-center justify-center mr-2 hover:bg-gradient-to-r from-red-400 to-red-600 hover:text-white">
                  <item.icon className=" w-6" />
                </div>
                <div className="">
                  <p className="text-sm text-red-600 flex items-center ">{item.title}</p>
                  <p className="text-xs text-gray-500 flex items-center ">{item.subtitle} </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="my-6">
          <p className="text-md mb-4">VagaChain</p>
          {vagachain.map((item, index) => (
            <Link href={item.link} key={index} className="" alt="">
              <div className="flex cursor-pointer my-4">
                <div className="w-10 h-10 rounded-lg border flex items-center justify-center mr-2 hover:bg-gradient-to-r from-red-400 to-red-600 hover:text-white">
                  <item.icon className=" w-6" />
                </div>
                <div className="">
                  <p className="text-sm text-red-600 flex items-center ">{item.title}</p>
                  <p className="text-xs text-gray-500 flex items-center ">{item.subtitle} </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="my-6">
          <p className="text-md mb-4">Learn more</p>
          {learnMore.map((item, index) => (
            <Link href={item.link} key={index} className="" alt="">
              <div className="flex cursor-pointer my-4">
                <div className="w-10 h-10 rounded-lg border flex items-center justify-center mr-2 hover:bg-gradient-to-r from-red-400 to-red-600 hover:text-white">
                  <item.icon className=" w-6" />
                </div>
                <div className="">
                  <p className="text-sm text-red-600 flex items-center ">{item.title}</p>
                  <p className="text-xs text-gray-500 flex items-center ">{item.subtitle} </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}


const Activity = ({ activity }) => {
  activity = JSON.parse(activity)

  return (
    <>
      {activity.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
        <div key={index} className="pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <p className="text-3xl">{activitydetails.find((a) => a.id === item.action)?.icon}</p>
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <p className="mt-1 text-sm text-red-500">{activitydetails.find((a) => a.id === item.action)?.name}</p>
                <p className="mt-1 text-xs text-gray-500">{item.createdAt}</p>

              </div>
              <div className="ml-4 flex flex-shrink-0">
                <div className="block w-full">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"

                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

const Settings = ({ workspace, isTeamOwner }) => {

  return (
    <>
      <General workspace={workspace} isTeamOwner={isTeamOwner} />
    </>

  )
}


const Modules = ({ modules }) => {
  const router = useRouter()
  const { workspaceSlug } = router.query
  modules = modules.length > 0 ? JSON.parse(modules) : []

  return (

    <div>
      <h2 className="text-sm font-medium text-gray-500">Apps</h2>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {modules.map((module, index) => (
          <li key={index} className={`col-span-1 flex rounded-md shadow-sm hover:bg-gray-200`}>
            <div
              className={classNames(types.find((t) => t.type === module.type)?.bgColor,
                'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md '
              )}
            >
              {types.find((t) => t.type === module.type)?.icon}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 ">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <Link href={`/account/${workspaceSlug}/modules/${module.type}/${module.moduleCode}`} className="font-medium text-red-600 hover:text-gray-600">
                  {module.name}
                </Link>
                <p className="text-gray-500">{types.find((t) => t.type === module.type)?.name}</p>
                <p className="text-gray-500 text-xs">{module.network.toUpperCase()}</p>

              </div>
              <div className="flex-shrink-0 pr-2">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  let isTeamOwner = false;
  let workspace = null;

  if (session) {
    workspace = await getWorkspace(
      session.user.userId,
      session.user.email,
      context.params.workspaceSlug
    );

    if (workspace) {
      isTeamOwner = isWorkspaceOwner(session.user.email, workspace);
    }
  }
  const activity = await getActivities(session.user.userId,)
  const modules = await getModules(session.user.userId)

  return {
    props: {
      isTeamOwner,
      activity: JSON.stringify(activity),
      modules: modules.length === 0 ? [] : JSON.stringify(modules),
    }
  }
}