import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import SlideOver from '@/components/SlideOver';
import Textarea from '@/components/Textarea';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import Select from '@/components/Select';
import api from '@/lib/common/api';
import { ticketStatus, ticketSource } from '@/config/modules/crm'
import Link from 'next/link';
import { contactActivity } from '@/lib/client/log';

function Tickets({ tickets, deal, team }) {
    tickets = JSON.parse(tickets)

    const router = useRouter()
    const { workspaceSlug, id } = router.query

    const [showOverlay, setShowOverlay] = useState(false)
    const [modalContent, setModalContent] = useState({})
    console.log("1", modalContent)
    const defaultValues = {
        ticketName: '',
        ticketDescription: '',
        pipeline: '',
        ticketStatus: '',
        source: '',
        ticketOwner: '',
        priority: '',
        createDate: '',
        associatedContact: deal?.contact?.id ? deal?.contact?.id : '',
        associatedCompany: deal?.company?.id ? deal?.company?.id : '',
        associatedDeal: deal.id,
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => addTicket(data);


    const addTicket = async (formInput) => {
        console.log(formInput)
        const res = await api(`/api/modules/customer-cloud/ticket`, {
            method: 'POST',
            body: { formInput },
        })
        await writeLog("Ticket Created", "ticket_created", new Date(), id)
        router.replace(router.asPath)
        toast.success("Ticket added successfully")
    }

    const deleteTicket = async (cid, dealId) => {
        const res = await api(`/api/modules/customer-cloud/ticket?ticketId=${cid}`, {
            method: "DELETE"
        })
        setShowOverlay(!showOverlay)
        await writeLog("Ticket deleted", "ticket_deleted", new Date(), dealId)

        router.replace(router.asPath)
        toast.success("Ticket deleted successfully")
    }

    const toggleModal = (item) => {

        setModalContent(item)
        setShowOverlay(!showOverlay)
    }

    return (
        <div className="px-6">
            <div className="flex justify-between gap-4 items-center">
                <div className="w-full px-4">
                    <p className="text-lg text-gray-800">Tickets</p>
                </div>

                <SlideOver
                    title="Add Ticket"
                    subTitle="Add a new ticket"
                    buttonTitle={<PlusIcon className="w-5 h-5 text-white" />}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className=" h-full pb-20">
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="ticketName"
                                        id="ticketName"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                label="Ticket Name"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.ticketName?.type === 'required' && <p role="alert">Ticket name is required</p>}</div>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="ticketStatus"
                                        id="ticketStatus"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                label="Ticket Status"
                                                {...field}
                                            >
                                                <option value="">Set status</option>
                                                {ticketStatus.map((status, index) => (

                                                    <option key={index} value={status.id}>{status.label}</option>
                                                ))}

                                            </Select>
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.ticketStatus?.type === 'required' && <p role="alert">Ticket name is required</p>}</div>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="source"
                                        id="source"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                label="Source"
                                                {...field}
                                            >
                                                <option value="">Select source</option>
                                                {ticketSource.map((source, index) => (

                                                    <option key={index} value={source.id}>{source.label}</option>
                                                ))}

                                            </Select>
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.source?.type === 'required' && <p role="alert">Ticket name is required</p>}</div>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="pipeline"
                                        id="pipeline "
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                label="Pipeline"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.pipeline?.type === 'required' && <p role="alert">Ticket name is required</p>}</div>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="createDate"
                                        id="createDate"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                type="date"
                                                label="Create Date"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.closeDate?.type === 'required' && <p role="alert">Ticket name is required</p>}</div>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="ticketOwner"
                                        id="ticketOwner"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                label="Ticket Owner"
                                                {...field}
                                            >
                                                <option value="">Select Owner</option>

                                                {team.map((owner, index) => (
                                                    <option key={index} value={owner.id}>{owner.user.name}</option>
                                                ))}

                                            </Select>
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.ticketStatus?.type === 'required' && <p role="alert">Ticket name is required</p>}</div>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="priority"
                                        id="priority"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                label="Priority"
                                                {...field}
                                            >
                                                <option value="">Select priority</option>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </Select>
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.priority?.type === 'required' && <p role="alert">Ticket name is required</p>}</div>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="ticketDescription"
                                        id="ticketDescription"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Textarea
                                                type="textarea"
                                                label="Description"
                                                className="w-full border border-gray-300 rounded-sm shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                rows={18}
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.ticketDescription?.type === 'required' && <p role="alert">Description is required</p>}</div>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <p>
                                        <span className="text-gray-700 text-sm">Associated Contact</span>
                                    </p>
                                    <p className="text-sm mt-2">{deal?.contact?.firstName ? deal?.contact?.firstName + ' ' + deal?.contact?.lastName : "No associated company"}</p>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${deal?.company?.id}`}>

                                    <div className="mt-1">
                                        <p>
                                            <span className="text-gray-700 text-sm">Associated Company</span>
                                        </p>
                                        <p className="text-sm mt-2">{deal?.company?.companyName ? deal?.company?.companyName : "No associated company"}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">
                            <Button
                                type="submit"
                                className="ml-4 inline-flex text-white justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white5shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </SlideOver>
            </div>

            <Modal show={showOverlay} title={modalContent.ticketName} toggle={toggleModal}>
                <div className="my-8 min-w-3xl">
                    <div className="grid grid-cols-3 gap-4 ">
                        <div className="py-2 px-4 bg-yellow-100 rounded-lg">
                            <p className=" text-xs text-gray-500">Status</p>
                            <p className="font-bold text-xs text-gray-500">{ticketStatus.find((t) => t.id === modalContent.ticketStatus)?.label}</p>
                        </div>
                        <div className="py-2 px-4 bg-gray-200 rounded-lg">
                            <p className=" text-xs text-gray-500">Priority</p>
                            <p className="font-bold text-xs text-gray-500">{modalContent.priority?.toUpperCase()}</p>
                        </div>
                        <div className="py-2 px-4 bg-orange-200 rounded-lg">
                            <p className=" text-xs text-gray-500">Owner</p>
                            <p className="font-bold text-xs text-gray-500">{team.find((t) => t.id === modalContent.ticketOwner)?.user?.name}</p>
                        </div>
                    </div>
                    <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${modalContent?.contact?.id}`}>
                        <div className="flex gap-4 border-t pt-5 mt-5">
                            <p className="text-xs text-gray-500">Contact:</p>
                            <p className="text-xs font-bold">{modalContent?.contact?.firstName + ' ' + modalContent?.contact?.lastName}</p>
                        </div>
                    </Link>
                </div>

                <div className="border-t border-b py-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="py-2 flex gap-4">
                            <p className=" text-xs text-gray-500">Source:</p>
                            <p className="font-bold text-xs text-gray-500">{ticketSource.find((t) => t.id === modalContent.source)?.label}</p>
                        </div>
                        <div className="py-2 px-4 flex gap-4">
                            <p className=" text-xs text-gray-500">Pipeline:</p>
                            <p className="font-bold text-xs text-gray-500">{modalContent.pipeline}</p>
                        </div>
                    </div>

                </div>
                <div className="my-8 w-96 h-96 overflow-y-auto">
                    <p className="text-sm text-gray-500">
                        {modalContent.ticketDescription}
                    </p>
                </div>
                <div className="border-t py-2">
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{modalContent?.user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{modalContent?.email}</p>
                    </div>
                    <div className="flex gap-4 mt-3">
                        <p className="text-xs text-gray-500">{moment(modalContent.createdBy).format("DD MMM. YYYY - hh:mm:ss")}</p>
                    </div>
                </div>
                <div className="flex w-full justify-end gap-4">
                    <Button
                        type="submit"
                        className="bg-gray-600 hover:bg-gray-700 focus:ring-red-500 text-white"
                        onClick={() => deleteTicket(modalContent.id, id)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                    >
                        Details
                    </Button>
                </div>
            </Modal >
            <div className="w-full px-4 mt-10">
                {tickets.map((item, index) => (
                    <div key={index} className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100" onClick={() => toggleModal(item)}>
                        <div className="p-4">
                            <div className="flex items-between">
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">{item.ticketName}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{ticketStatus.find((t) => t.id === item.ticketStatus)?.label}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>

                                </div>
                                <div className="flex pt-0.5 items-center justify-end">
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
                    </div>
                ))}
            </div>
        </div >
    )
}

export default Tickets


const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}