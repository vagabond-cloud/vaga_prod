import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useSign from '@/hooks/data/useSign'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'

const Modal = ({ children, show, title, toggle, url, session }) => {
    const router = useRouter()

    const [cookie, setCookie] = useCookies(['vagaSession'])

    const { data, isLoading, isError } = useSign(session)

    show = data ? false : true

    useEffect(() => {
        if (data) {
            setCookie('vagaSession', session, { maxAge: 3600 });
            replaceSession()
        }
    }, [data])

    const replaceSession = () => {
        router.reload()
    }

    return (
        <Transition appear as={Fragment} show={show}>
            <Dialog
                className="fixed inset-0 z-50 overflow-y-auto text-gray-800"
                onClose={toggle}
            >
                <div className="flex items-center justify-center h-screen p-5">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>
                    <span aria-hidden="true" className="inline-block align-middle">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="relative inline-block p-10 my-10 space-y-5 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl">
                            <Dialog.Title as="h2" className="text-2xl font-bold leading-5">
                                {title}
                            </Dialog.Title>
                            {children}
                            <button
                                className="absolute top-0 outline-none right-5"
                                onClick={toggle}
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <div className="">
                                {!isLoading &&
                                    <img src={url} className="" alt="" />
                                }
                                <p className="w-full text-center pt-4">{session}</p>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

Modal.defaultProps = {
    show: false,
    subtitle: '',
    title: '',
    toggle: null,
};

export default Modal;
