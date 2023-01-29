import { useRouter } from 'next/router'
import { useState } from 'react'
import SlideOver from '@/components/SlideOver'
import { PlusIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Input from '@/components/Input'
import Button from '@/components/Button'
import moment from 'moment'
import Modal from '@/components/Modal'
import api from '@/lib/common/api'
import { contactActivity } from '@/lib/client/log';
import toast from 'react-hot-toast';
import Select from '@/components/Select';
import { ticketStatus, ticketSource } from '@/config/modules/crm';
import { Controller, useForm } from "react-hook-form";
import Textarea from '@/components/Textarea';
import Link from 'next/link'

function Tickets({ contact }) {

    console.log(contact)
    const router = useRouter()
    const { workspaceSlug, id } = router.query

    const [note, setNote] = useState("")
    const [title, setTitle] = useState("")
    const [reminder, setReminder] = useState("")
    const [date, setDate] = useState("")
    const [type, setType] = useState("")
    const [priority, setPriority] = useState("")
    const [queue, setQueue] = useState("")
    const [assigned, setAssigned] = useState("")

    const [showOverlay, setShowOverlay] = useState(false)
    const [modalContent, setModalContent] = useState({})
    console.log("2", modalContent)
    const defaultValues = {
        note: "",
        title: "",
        reminder: "",
        date: "",
        type: "",
        priority: "",
        queue: "",
        assigned: "",
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => addTask(data);

    const addTask = async (formInput) => {
        const res = await api(`/api/modules/task`, {
            method: "PUT",
            body: {
                contactId: id,
                note: formInput.note,
                title: formInput.title,
                reminder: formInput.reminder,
                type: formInput.type,
                priority: formInput.priority,
                queue: formInput.queue,
                assigned: formInput.assigned,
                date: new Date(formInput.date),
            }
        })
        await writeLog("Task Created", "task_created", new Date(), id)

        router.replace(router.asPath)
        toast.success("Task added successfully")
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
        setShowOverlay(!showOverlay)
        setModalContent(item)
    }

    return (
        <div className="px-6">
            <div className="flex justify-between gap-4 items-center">
                <div className="w-full px-4">
                    <p className="text-lg text-gray-800">Tickets</p>
                </div>

            </div>
            <div className="w-full px-4 mt-10">
                {contact?.ticket.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
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
                            <p className="font-bold text-xs text-gray-500">{modalContent?.user?.name}</p>
                        </div>
                    </div>
                    <Link href={`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${modalContent?.deal?.id}`}>
                        <div className="flex gap-4 border-t pt-5 mt-5">
                            <p className="text-xs text-gray-500">Deal:</p>
                            <p className="text-xs font-bold">{modalContent?.deal?.dealName}</p>
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
                        onClick={() => deleteTicket(modalContent.id, modalContent?.associatedDeal)}
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
        </div>
    )
}

export default Tickets


const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}