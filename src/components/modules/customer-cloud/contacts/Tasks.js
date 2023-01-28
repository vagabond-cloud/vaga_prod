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
import { taskTypes, dueDate } from '@/config/modules/crm';
import { Controller, useForm } from "react-hook-form";
import Textarea from '@/components/Textarea';

function Tasks({ profile, tasks }) {
    tasks = JSON.parse(tasks)

    const router = useRouter()
    const { id } = router.query

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

    const deleteTask = async (cid) => {
        const res = await api(`/api/modules/task?contactId=${cid}`, {
            method: "DELETE"
        })
        setShowOverlay(!showOverlay)
        await writeLog("Task Created", "task_created", new Date(), id)

        router.replace(router.asPath)
        toast.success("Task deleted successfully")
    }

    const toggleModal = (item) => {

        setModalContent(item)
        setShowOverlay(!showOverlay)
    }

    return (
        <div className="px-6">
            <div className="flex justify-between gap-4 items-center">
                <div className="w-full px-4">
                    <p className="text-lg text-gray-800">Tasks</p>
                </div>
                <SlideOver
                    title="Add Call"
                    buttonTitle={<PlusIcon className="w-5 h-5 text-white" />}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="px-4 my-6">
                            <div className="mb-4">
                                <Controller
                                    name="title"
                                    id="title"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            label="Title"
                                            placeholder="Enter your task"
                                            {...field}
                                        />
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.title?.type === 'required' && <p role="alert">Title is required</p>}</div>
                            </div>

                            <div className="mb-4">
                                <Controller
                                    name="date"
                                    id="date"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            type="date"
                                            label="Due Date"
                                            {...field}
                                        />
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.date?.type === 'required' && <p role="alert">Date is required</p>}</div>
                            </div>
                            <div className="mb-4">
                                <Controller
                                    name="reminder"
                                    id="reminder"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            type="date"
                                            label="Reminder Date"
                                            placeholder="Enter your task"
                                            {...field}
                                        />
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.reminder?.type === 'required' && <p role="alert">Reminder is required</p>}</div>

                            </div>
                            <div className="mb-4">
                                <Controller
                                    name="type"
                                    id="type"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            label="Type"
                                            {...field}
                                        >
                                            {taskTypes.map((item, index) => (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            ))}

                                        </Select>
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.type?.type === 'required' && <p role="alert">Type is required</p>}</div>
                            </div>
                            <div className="mb-4">
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
                                            <option>Priority</option>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>

                                        </Select>
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors?.priority?.type === 'required' && <p role="alert">Priority is required</p>}</div>
                            </div>
                            <div className="mb-4">
                                <Controller

                                    name="note"
                                    id="note"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Textarea
                                            type="textarea"
                                            placeholder="Add Note"
                                            label="Note"
                                            className="w-full border border-gray-300 rounded-sm shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                            rows={18}
                                            {...field}
                                        />
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.note?.type === 'required' && <p role="alert">Note is required</p>}</div>
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
            <div className="w-full px-4 mt-10">
                {tasks.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
                    <div key={index} className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100" onClick={() => toggleModal(item)}>
                        <div className="p-4">
                            <div className="flex items-between">
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{taskTypes.find((t) => t.id === item.type)?.name}</p>
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
            <Modal show={showOverlay} title={modalContent.title} toggle={toggleModal}>
                <div className="my-8 w-96">
                    <div className='flex justify-between'>
                        <p className="text-sm text-gray-500 mb-4">
                            {taskTypes.find((t) => t.id === modalContent.type)?.name}
                        </p>
                        <p className={`inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800`}>
                            {modalContent.priority?.toUpperCase()}

                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        {modalContent.note}
                    </p>
                </div>
                <div className="border-t py-2">
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{modalContent?.user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{moment(modalContent.createdBy).format("DD MMM. YYYY - hh:mm:ss")}</p>
                    </div>
                </div>
                <div className="flex w-full justify-end gap-4">
                    <Button
                        type="submit"
                        className="bg-gray-600 hover:bg-gray-700 focus:ring-red-500 text-white"
                        onClick={() => deleteTask(modalContent.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                        onClick={() => setShowOverlay(!showOverlay)}
                    >
                        Close
                    </Button>
                </div>
            </Modal >
        </div>
    )
}

export default Tasks


const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}