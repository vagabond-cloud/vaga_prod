import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { AccountLayout } from '@/layouts/index';
import Link from 'next/link';
import Image from "next/image";
import {
    ChevronDownIcon,
    PlusIcon,
    EllipsisVerticalIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/outline";
import CardItem from "@/components/modules/customer-cloud/projects/CardItem";
import Overview from "@/components/modules/customer-cloud/projects/Overview";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { getProjectItems } from '@/prisma/services/modules'
import api from '@/lib/common/api';
import { getSession } from 'next-auth/react';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { getModule, getProjectData } from '@/prisma/services/modules';
import { getMembers } from '@/prisma/services/membership';
import { useForm, Controller } from "react-hook-form";
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import { useRouter } from 'next/router';
import SlideOver from '@/components/SlideOver';
import { projectStatus, projectType, priority } from '@/config/modules/projects'
import Select from '@/components/Select';

function createGuidId() {
    const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    return timestamp + "xxxxxxxxxxxxxxxx".replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16)).toLowerCase();
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Home({ projectsItems, project }) {

    const router = useRouter();
    const { workspaceSlug, id, tab } = router.query;

    const tabs = [
        { name: 'Overview', href: 'overview', current: tab === 'overview' || !tab ? true : false },
        { name: 'Board', href: 'board', current: tab === 'board' ? true : false },
        { name: 'Checklist', href: 'checklist', current: tab === 'checklist' ? true : false },
        { name: 'Documents', href: 'documents', current: tab === 'documents' ? true : false },
    ]



    const BoardData = [
        { name: "Backlog", id: "1", boardId: [0, 1] },
        { name: "In Progress", id: "2", boardId: 2 },
        { name: "Under Review", id: "3", boardId: 3 },
        { name: "Accepted", id: "4", boardId: 4 },
        { name: "Closed", id: "5", boardId: 5 },
        { name: "Rejected", id: "6", boardId: 6 },
    ].map(board => ({
        name: board.name,
        id: board.id,
        items: projectsItems
            .filter(p => Array.isArray(board.boardId) ? board.boardId.includes(p?.boardId) : p?.boardId === board.boardId)
            .sort((a, b) => a?.boardIndex - b?.boardIndex)
    }));



    const [ready, setReady] = useState(false);
    const [boardData, setBoardData] = useState(BoardData);
    const [showForm, setShowForm] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(0);
    const [winReady, setwinReady] = useState(false);

    useEffect(() => {
        setwinReady(true);
    }, []);

    useEffect(() => {
        if (process.browser) {
            setReady(true);
        }
    }, []);

    const onDragEnd = async (re) => {

        if (!re.destination) return;
        let newBoardData = boardData;

        var dragItem =
            newBoardData[parseInt(re.source.droppableId)].items[re.source.index];
        newBoardData[parseInt(re.source.droppableId)].items.splice(
            re.source.index,
            1
        );
        newBoardData[parseInt(re.destination.droppableId)].items.splice(
            re.destination.index,
            0,
            dragItem
        );
        setBoardData(newBoardData);
        const res = await api(`/api/modules/customer-cloud/projectItem`, {
            method: 'PUT',
            body: {
                formInput: {
                    id: dragItem.id,
                    addedById: dragItem.addedById,
                    projectId: dragItem.projectId,
                    email: dragItem.email,
                    title: dragItem.title,
                    itemStatus: dragItem.itemStatus,
                    itemOwner: dragItem.itemOwner,
                    priority: dragItem.priority,
                    boardId: parseFloat(re.destination.droppableId) + 1,
                    boardIndex: parseFloat(re.destination.index),
                    assignees: dragItem.assignees,
                    chat: dragItem.chat,
                    attachment: dragItem.attachment,
                },
                itemId: re.draggableId
            }
        })

    };

    // const onTextAreaKeyPress = (e) => {
    //     if (e.keyCode === 13) //Enter
    //     {
    //         const val = e.target.value;
    //         if (val.length === 0) {
    //             setShowForm(false);
    //         }
    //         else {
    //             const boardId = e.target.attributes['data-id'].value;
    //             const item = {
    //                 title: val,
    //                 priority: 0,
    //                 chat: 0,
    //                 attachment: 0,
    //                 assignees: []
    //             }
    //             let newBoardData = boardData;
    //             newBoardData[boardId].items.push(item);
    //             setBoardData(newBoardData);
    //             setShowForm(false);
    //             e.target.value = '';
    //         }
    //     }
    // }

    const defaultValues = {
        priority: 0,
        title: '',
        chat: 0,
        attachment: 0,
        assignees: [],
        boardId: '0',
        boardIndex: 0,
        projectId: id,
        itemStatus: '0',
        itemOwner: '0',
    }

    const { handleSubmit, control, setValue, reset, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => onAddCard(data);

    const clear = () => reset();


    const onAddCard = async (formInput) => {
        const boardId = 0;

        const res = await api(`/api/modules/customer-cloud/projectItem`, {
            method: "POST",
            body: { formInput },
        });

        const newBoardData = [...boardData];
        newBoardData[boardId].items = [...newBoardData[boardId].items, formInput];
        setShowForm(false);
        clear();
        router.reload()
    };

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Modules | Dashboard`} />
            <Content.Title
                title="Projects Board"
                subtitle="Kanban board for your projects"
            />
            <Content.Divider />
            <Content.Container>
                <div className="p-10 flex flex-col h-screen">
                    {/* Board header */}
                    <div className="flex flex-initial justify-between">
                        <div>
                            <div className="sm:hidden">
                                <label htmlFor="tabs" className="sr-only">
                                    Select a tab
                                </label>
                                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                                <select
                                    id="tabs"
                                    name="tabs"
                                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                                    defaultValue={tabs.find((tab) => tab.current).name}
                                >
                                    {tabs.map((tab) => (
                                        <option key={tab.name}>{tab.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="hidden sm:block">
                                <div className="border-b border-gray-200">
                                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                        {tabs.map((tab) => (
                                            <Link
                                                key={tab.name}
                                                href={`/account/${workspaceSlug}/modules/customer-cloud/projects/board/${id}?tab=${tab.href}`}
                                                className={classNames(
                                                    tab.current
                                                        ? 'border-red-500 text-red-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                                )}
                                                aria-current={tab.current ? 'page' : undefined}
                                            >
                                                {tab.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <SlideOver
                            title="Add Task"
                            subTitle="Add a new deal to your account"
                            buttonTitle="Add Task"
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="overflow-auto h-full pb-20">
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="title"
                                            id="title"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea className="border-gray-300 rounded-sm focus:ring-red-400 w-full"
                                                    rows={3} placeholder="Task info"
                                                    data-id={0}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="itemStatus"
                                            id="itemStatus"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Status"
                                                >
                                                    <option value="">Choose Status</option>
                                                    {
                                                        projectStatus.map((stage, index) => (
                                                            <option key={index} value={stage.id}>{stage.name}</option>
                                                        )
                                                        )}
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="priority"
                                            id="priority"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Priority"
                                                >
                                                    <option value="">Choose Status</option>
                                                    {
                                                        priority.map((stage, index) => (
                                                            <option key={index} value={stage.id}>{stage.name}</option>
                                                        )
                                                        )}
                                                </Select>
                                            )}
                                        />
                                    </div>

                                </div>
                                <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">
                                    <Button
                                        type="submit"
                                        className="bg-red-600 text-white"
                                        onClick={() => {
                                            setValue('id', createGuidId())
                                            setValue('boardId', selectedBoard
                                            )
                                        }} >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </SlideOver>
                    </div>
                    {(tab === 'overview' || !tab) &&
                        <Overview project={project} />
                    }

                    {tab === 'board' &&

                        <>
                            {/* Board columns */}
                            {ready && (
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <div className="overflow-x-auto w-full h-screen">
                                        <div className="grid grid-cols-6 gap-2 my-5 ">
                                            {boardData.map((board, bIndex) => {
                                                return (
                                                    <div key={board.name} className="">
                                                        <Droppable droppableId={`${bIndex}`}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.droppableProps}
                                                                    className={`${snapshot.isDraggingOver && "bg-blue-50"}`}
                                                                >
                                                                    <Card
                                                                        className={`bg-gray-100 rounded-md shadow-md flex flex-col relative overflow-hidden`}
                                                                    >
                                                                        <span
                                                                            className="w-full h-1 bg-gradient-to-r from-pink-700 to-red-200 absolute inset-x-0 top-0"
                                                                        ></span>
                                                                        <h4 className=" p-3 flex justify-between items-center mb-2">
                                                                            <span className="text-sm text-gray-600">
                                                                                {board.name}
                                                                            </span>
                                                                            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                                                                        </h4>

                                                                        <div className="overflow-y-auto overflow-x-hidden h-auto"
                                                                            style={{ maxHeight: 'calc(100vh - 290px)' }}>

                                                                            {board.items.length > 0 &&
                                                                                board.items.map((item, iIndex) => {
                                                                                    return (
                                                                                        <CardItem
                                                                                            key={item.id}
                                                                                            data={item}
                                                                                            index={iIndex}
                                                                                            className="m-3"
                                                                                        />
                                                                                    );
                                                                                })}
                                                                            {provided.placeholder}
                                                                            <div className="h-6"></div>
                                                                        </div>

                                                                        {/* {
                                                                    showForm && selectedBoard === bIndex ? (
                                                                        <form onSubmit={handleSubmit(onSubmit)}>
                                                                            <div className="p-3">
                                                                                <Controller
                                                                                    name="title"
                                                                                    id="title"
                                                                                    control={control}
                                                                                    render={({ field }) => (
                                                                                        <Textarea className="border-gray-300 rounded-sm focus:ring-red-400 w-full"
                                                                                            rows={3} placeholder="Task info"
                                                                                            data-id={bIndex}
                                                                                            {...field}
                                                                                            onKeyDown={(e) => onTextAreaKeyPress(e)}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <Button
                                                                                    type="submit"
                                                                                    className="bg-red-600 text-white"
                                                                                    onClick={() => {
                                                                                        setValue('id', createGuidId())
                                                                                        setValue('boardId', selectedBoard
                                                                                        )
                                                                                    }} >
                                                                                    Save
                                                                                </Button>
                                                                            </div>
                                                                        </form>
                                                                    ) : (
                                                                        <Button
                                                                            className="flex justify-center items-center my-3 space-x-2 text-xs"
                                                                            onClick={() => { setSelectedBoard(bIndex); setShowForm(true); }}
                                                                        >
                                                                            <span>Add task</span>
                                                                            <PlusCircleIcon className="w-5 h-5 text-gray-500" />
                                                                        </Button>
                                                                    )
                                                                } */}
                                                                    </Card>
                                                                </div>
                                                            )
                                                            }
                                                        </Droppable>

                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                </DragDropContext>
                            )}
                        </>
                    }
                </div>
            </Content.Container >
        </AccountLayout >
    );
}

export async function getServerSideProps(context) {

    //This retrieves the current session using the getSession function and assigns it to the session variable.
    const session = await getSession(context);

    //These two variables are initialized as false and null respectively. 
    //They are used to store whether the current user is a team owner and the current workspace.
    let isTeamOwner = false;
    let workspace = null;

    //This retrieves the module data using the getModule function and assigns it to the modules variable. 
    //It takes the id from the params property of the context object.
    const modules = await getModule(context.params.id);

    //If a session exists, it retrieves the workspace data using the getWorkspace function and assigns it to the workspace variable. 
    //Then it checks if the current user is the owner of the workspace using the isWorkspaceOwner function and assigns it to the isTeamOwner variable.

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

    const projectsItems = await getProjectItems(context.params.id)
    const project = await getProjectData(context.params.id)
    const team = await getMembers(context.query.workspaceSlug)

    return {
        props: {
            projectsItems: JSON.parse(JSON.stringify(projectsItems)),
            team: JSON.parse(JSON.stringify(team)),
            workspace: JSON.parse(JSON.stringify(workspace)),
            modules: JSON.parse(JSON.stringify(modules)),
            project: JSON.parse(JSON.stringify(project)),
        }
    }
}