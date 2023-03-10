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
import { contactActivity } from '@/lib/client/log';
import api from '@/lib/common/api'

function Notes({ profile, notes }) {
    notes = JSON.parse(notes)

    const router = useRouter()
    const { id } = router.query

    const [showOverlay, setShowOverlay] = useState(false)
    const [modalContent, setModalContent] = useState({})

    const defaultValues = {
        title: '',
        note: ''
    }

    const { handleSubmit, control, resetField, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => addNote(data);


    const addNote = async (formInput) => {
        try {
            const res = await api(`/api/modules/note`, {
                method: "POST",
                body: {
                    contactId: id,
                    note: formInput.note,
                    title: formInput.title
                }
            })

            resetField("title")
            resetField("note")

            await writeLog("Note Created", "note_created", new Date(), id)

            router.replace(router.asPath)
            toast.success("Note added successfully")
        } catch (error) {
            console.log("ERROR", error)
        }
    }

    const deleteNote = async (cid) => {
        try {
            const res = await api(`/api/modules/note?noteId=${cid}`, {
                method: "DELETE"
            })

            setShowOverlay(!showOverlay)

            await writeLog("Note Deleted", "note_deleted", new Date(), id)

            router.replace(router.asPath)
            toast.success("Note deleted successfully")
        }
        catch (error) {
            console.log("ERROR", error)
        }
    }



    const toggleModal = (item) => {

        setModalContent(item)
        setShowOverlay(!showOverlay)
    }

    return (
        <div className="px-6">
            <div className="flex justify-between gap-4 items-center">
                <div className="w-full px-4">
                    <p className="text-lg text-gray-800">Notes</p>
                </div>
                <SlideOver
                    title="Add Note"
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
                                            placeholder="Title"
                                            {...field}
                                        />
                                    )}
                                />
                                <div className="text-red-600 mt-1 text-xs">{errors.title?.type === 'required' && <p role="alert">Title is required</p>}</div>

                            </div>
                            <Controller
                                name="note"
                                id="note"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Textarea
                                        type="textarea"
                                        placeholder="Add Note"
                                        className="w-full border border-gray-300 rounded-sm shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        rows={18}
                                        {...field}
                                    />
                                )}
                            />
                            <div className="text-red-600 mt-1 text-xs">{errors.note?.type === 'required' && <p role="alert">Note is required</p>}</div>



                        </div>
                        <div className="px-4 my-6">
                            <p className="text-md font-medium text-gray-500">{profile.name}</p>
                            <p className="text-sm my-1 text-gray-500">{profile.fields.Lead}</p>
                            <p className="text-sm my-1 text-gray-500">{profile.fields.Stage}</p>
                            <p className="text-sm my-2 text-gray-500">{moment().format("DD MMM. YYYY - hh:mm:ss")}</p>
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
                {notes.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
                    <div key={index} className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100" onClick={() => toggleModal(item)}>
                        <div className="p-4">
                            <div className="flex items-between">
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.note}</p>
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
                <div className="my-8 w-96 h-96 overflow-y-auto">
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

export default Notes


const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}