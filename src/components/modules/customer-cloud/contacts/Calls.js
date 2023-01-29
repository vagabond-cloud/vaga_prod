import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import Textarea from '@/components/Textarea';
import { outcomes } from '@/config/modules/crm';
import { contactActivity } from '@/lib/client/log';
import api from '@/lib/common/api';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import toast from 'react-hot-toast';

function Notes({ profile, calls }) {
    calls = JSON.parse(calls)

    const router = useRouter()
    const { id } = router.query

    const [showOverlay, setShowOverlay] = useState(false)
    const [modalContent, setModalContent] = useState({})


    const defaultValues = {
        note: '',
        outcome: '',
        direction: '',
        date: '',
        time: ''
    }


    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => addCall(data);

    const addCall = async (formInput) => {

        const res = await api(`/api/modules/call`, {
            method: "PUT",
            body: {
                contactId: id,
                note: formInput.note,
                outcome: formInput.outcome,
                direction: formInput.direction,
                date: new Date(formInput.date),
                time: formInput.time
            }
        })
        await writeLog("Call Created", "call_created", new Date(), id)
        router.replace(router.asPath)
        toast.success("Call added successfully")
    }

    const deleteCall = async (cid) => {
        const res = await api(`/api/modules/call?contactId=${cid}`, {
            method: "DELETE"
        })
        setShowOverlay(!showOverlay)
        await writeLog("Call Deleted", "call_deleted", new Date(), id)
        router.replace(router.asPath)
        toast.success("Call deleted successfully")
    }

    const toggleModal = (item) => {

        setModalContent(item)
        setShowOverlay(!showOverlay)
    }

    return (
        <div className="px-6">
            <div className="flex justify-between gap-4 items-center">
                <div className="w-full px-4">
                    <p className="text-lg text-gray-800">Calls</p>
                </div>
                <SlideOver
                    title="Add Call"
                    buttonTitle={<PlusIcon className="w-5 h-5 text-white" />}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="px-4 my-6">
                            <div className="mb-4 flex gap-4">
                                <p className="text-sm font-medium text-gray-500">Contacted</p>
                                <p className="text-sm font-medium text-gray-500"> {profile.fields.Email}</p>
                            </div>

                            <div className="mb-4">
                                <Controller
                                    name="outcome"
                                    id="outcome"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            label="Outcome"
                                            {...field}
                                        >
                                            {
                                                outcomes.map((stage, index) => (
                                                    <option key={index} value={stage.stage}>{stage.stage}</option>
                                                )
                                                )}
                                        </Select>
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.outcome?.type === 'required' && <p role="alert">Outcome is required</p>}</div>
                            </div>
                            <div className="mb-4">
                                <Controller
                                    name="direction"
                                    id="direction"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            label="Direction"
                                            {...field}
                                        >
                                            <option value="inbound">Inbound</option>
                                            <option value="outbound">Outbound</option>

                                        </Select>
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.direction?.type === 'required' && <p role="alert">Direction is required</p>}</div>
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
                                            label="Date"
                                            placeholder="Date"
                                            {...field}
                                        />
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.date?.type === 'required' && <p role="alert">Date is required</p>}</div>
                            </div>
                            <div className="mb-4">
                                <Controller
                                    name="time"
                                    id="time"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            type="time"
                                            label="Time"
                                            placeholder="Date"
                                            {...field}
                                        />
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.time?.type === 'required' && <p role="alert">Time is required</p>}</div>


                            </div>
                            <Controller
                                name="note"
                                id="note"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        type="textarea"
                                        label="Note"
                                        className="w-full border border-gray-300 rounded-sm shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        rows={18}
                                        {...field}
                                    />
                                )}
                            />
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
            </div >
            <div className="w-full px-4 mt-10">
                {calls.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
                    <div key={index} className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100" onClick={() => toggleModal(item)}>
                        <div className="p-4">
                            <div className="flex items-between">
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">{item.outcome}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.direction.toUpperCase()}</p>
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
            <Modal show={showOverlay} title={modalContent.email} toggle={toggleModal}>
                <div className="my-8 w-96">
                    <div className='flex items-center justify-between'>
                        <p className="text-sm text-gray-500 mb-4">
                            {modalContent.outcome}
                        </p>
                        <p className={`${modalContent.direction === "inbound" ? "inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800" : "inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800"}text-sm text-gray-600 mb-4`}>
                            {modalContent.direction === "inbound" ? "Inbound" : "Outbound"}
                        </p>
                    </div>

                    <div className="flex gap-4 mb-4">
                        <p className="text-xs text-gray-500">{moment(modalContent.date).format("DD MMM. YYYY")}</p>
                        <p className="text-xs text-gray-500">{modalContent.time}</p>

                    </div>
                    <div className="my-8 w-96 h-96 overflow-y-auto">
                        <p className="text-sm text-gray-500">
                            {modalContent.note}
                        </p>
                    </div>
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
                        onClick={() => deleteCall(modalContent.id)}
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
        </div >
    )
}

export default Notes


const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}