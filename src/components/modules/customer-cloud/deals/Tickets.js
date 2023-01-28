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

function Tickets({ }) {
    // notes = JSON.parse(notes)

    const router = useRouter()
    const { id } = router.query

    const [showOverlay, setShowOverlay] = useState(false)
    const [modalContent, setModalContent] = useState({})

    const defaultValues = {
        ticketName: '',
        ticketDescription: '',
        pipeline: '',
        ticketStatus: '',
        source: '',
        ticketOwner: '',
        priority: '',
        createDate: '',
        associatedContact: '',
        associatedCompany: '',
        associatedDeal: id,
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => console.log(data);


    const addNote = async (formInput) => {
        await writeLog("Note Created", "note_created", new Date(), id)
        router.replace(router.asPath)
        toast.success("Note added successfully")
    }

    const deleteNote = async (cid) => {
        setShowOverlay(!showOverlay)
        await writeLog("Note Deleted", "note_deleted", new Date(), id)

        router.replace(router.asPath)
        toast.success("Note deleted successfully")
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
                                                <option value="new">New</option>
                                                <option value="wait_contact">Wait on contact</option>
                                                <option value="wait_us">Wait on us</option>
                                                <option value="closed">Closed</option>
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
                                                <option value="chat">Chat</option>
                                                <option value="email">Email</option>
                                                <option value="form">Form</option>
                                                <option value="phone">Phone</option>
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
                                                <option value="">Set status</option>
                                                <option value="new">New</option>
                                                <option value="wait_contact">Wait on contact</option>
                                                <option value="wait_us">Wait on us</option>
                                                <option value="closed">Closed</option>
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
                                    <Controller
                                        name="associatedContact"
                                        id="associatedContact"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                label="Associated Contact"
                                                {...field}
                                            >
                                                <option value="">Select priority</option>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </Select>
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.associatedContact?.type === 'required' && <p role="alert">Ticket name is required</p>}</div>
                                </div>
                            </div>
                            <div className="px-4 my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="associatedCompany"
                                        id="associatedCompany"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                label="Associated Company"
                                                {...field}
                                            >
                                                <option value="">Select priority</option>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </Select>
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.associatedCompany?.type === 'required' && <p role="alert">Ticket name is required</p>}</div>
                                </div>
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

            <Modal show={showOverlay} title={modalContent.title} toggle={toggleModal}>
                <div className="my-8 w-96">
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
                        onClick={() => deleteNote(modalContent.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                    >
                        Close
                    </Button>
                </div>
            </Modal >
        </div>
    )
}

export default Tickets


const writeLog = async (type, action, date, contactId) => {
}