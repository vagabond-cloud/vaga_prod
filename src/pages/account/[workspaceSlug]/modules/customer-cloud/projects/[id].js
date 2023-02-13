import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { AccountLayout } from '@/layouts/index';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import SlideOver from '@/components/SlideOver';
import { useForm, Controller } from "react-hook-form";
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import { projectType, projectStatus, priority } from '@/config/modules/projects'
import { getMembers } from '@/prisma/services/membership';
import api from '@/lib/common/api';
import { getSession } from 'next-auth/react';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { getModule, getDeals, getAllProjects } from '@/prisma/services/modules';
import toast from 'react-hot-toast';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Projects({ projects, team, workspace, modules, deals }) {
    const router = useRouter();
    const { workspaceSlug } = router.query;

    const defaultValues = {
        projectName: '',
        projectType: '',
        projectStatus: '',
        projectOwner: '',
        priority: '',
        resolution: '',
        assignedTo: '',
        imageUrl: '',
        description: '',
        startDate: '',
        endDate: '',
        dealId: '',
        moduleId: modules.id,
    }

    const { handleSubmit, control, setValue, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => createProject(data);


    const createProject = async (formInput) => {
        const response = await api(`/api/modules/customer-cloud/project`, {
            method: 'POST',
            body: {
                formInput,
                workspaceId: workspace[0].id,
                moduleId: modules.id
            }
        });
        toast.success('Project created successfully');
        router.replace(router.asPath)

    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Modules | Dashboard`} />
            <Content.Title
                title="Projects"
                subtitle="List of all Projects"
            />
            <Content.Divider />
            <Content.Container>
                <div className="mt-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">Project List</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the projects in your account including boards, details and documents.
                            </p>
                        </div>
                        <SlideOver
                            title="Add Project"
                            subTitle="Add a new project to your account"
                            buttonTitle="Add Project"
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="overflow-scroll h-full pb-20">
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="projectName"
                                            id="projectName"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Project Name"
                                                />
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="projectType"
                                            id="projectType"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Project Type"
                                                >
                                                    <option value="">Define a type</option>
                                                    {projectType.map((type, index) => (
                                                        <option key={index} value={type.id}>{type.name}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="projectStatus"
                                            id="projectStatus"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Project Status"
                                                >
                                                    <option value="">Define a status</option>

                                                    {projectStatus.map((type, index) => (
                                                        <option key={index} value={type.id}>{type.name}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="projectOwner"
                                            id="projectOwner"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Project Owner"
                                                >
                                                    <option value="">Select an Owner</option>

                                                    {team.map((type, index) => (
                                                        <option key={index} value={type.id}>{type.user.name}</option>
                                                    ))}

                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="priority"
                                            id="priority"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Priority"
                                                >
                                                    <option value="">Choose a priority</option>

                                                    {priority.map((type, index) => (
                                                        <option key={index} value={type.id}>{type.name}</option>
                                                    ))}

                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="resolution"
                                            id="resolution"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Resolution"
                                                />
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="assignedTo"
                                            id="assignedTo"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Assigned to"
                                                >
                                                    <option value="">Assign a member</option>

                                                    {team.map((type, index) => (
                                                        <option key={index} value={type.id}>{type.user.name}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="description"
                                            id="description"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Textarea
                                                    {...field}
                                                    rows={5}
                                                    label="Description"
                                                />
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="startDate"
                                            id="startDate"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    label="Start Date"
                                                />
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="endDate"
                                            id="endDate"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    label="End Date"
                                                />
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="dealId"
                                            id="dealId"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Associated Deal"
                                                >
                                                    <option value="">Select Deal</option>
                                                    {deals.map((deal, index) => (
                                                        <option key={index} value={deal.id}>{deal.dealName}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                </div>
                                <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">
                                    <Button
                                        type="submit"
                                        className="ml-4 inline-flex justify-center  rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </SlideOver>
                    </div>
                    <div>
                        <div className="w-full px-4 mt-10">
                            {projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                                <Link href={`/account/${workspaceSlug}/modules/customer-cloud/projects/board/${item.id}`} key={index} className="">
                                    <div className="p-4 cursor-pointer pointer-events-auto w-full max-w-full overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100">
                                        <div className="flex items-between">
                                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                                <div className="flex justify-between">
                                                    <p className="text-sm font-medium text-gray-900">{item.projectName} </p>
                                                </div>
                                                <p className="text-xs text-gray-400 truncate pr-8 my-2">{projectType.find((t) => t.id === item.projectType).name}</p>
                                                <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>

                                            </div>
                                            <div className="flex pt-0.5 items-center justify-end">
                                                <p className="text-sm font-medium text-green-600 mr-6">{projectStatus.find((s) => s.id === item.projectStatus).name} </p>

                                                <ChevronRightIcon className="h-5 w-5 text-gray-800" />
                                            </div>
                                            <div className="ml-4 flex flex-shrink-0">
                                                <div className="block w-full">
                                                    <button
                                                        type="button"
                                                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    >
                                                        <span className="sr-only">Close</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
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

    const projects = await getAllProjects(modules.id)
    const team = await getMembers(context.query.workspaceSlug)
    const deals = await getDeals(modules.id)


    return {
        props: {
            projects,
            team: JSON.parse(JSON.stringify(team)),
            workspace: JSON.parse(JSON.stringify(workspace)),
            modules: JSON.parse(JSON.stringify(modules)),
            deals: JSON.parse(JSON.stringify(deals)),
        }
    }
}
