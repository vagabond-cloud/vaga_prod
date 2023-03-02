import Input from '@/components/Input'
import Button from '@/components/Button'
import api from '@/lib/common/api'
import { useState, useEffect } from 'react'
import Modal from '@/components/Modal/signin'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import Image from 'next/image'
import { useForm, Controller } from "react-hook-form";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function CreateSession({ cookies, session }) {
    const router = useRouter()

    const [url, setUrl] = useState("")
    const [sessionData, setSession] = useState([])
    const [showModal, setModalState] = useState(false);
    const [cookie, setCookie, removeCookie] = useCookies();
    const [gatewayURL, setGatewayURL] = useState("")

    const defaultValues = {
        amount: '',
        to: ''
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => createNewSession(data);



    const getSession = async () => {
        const { data, qrCodeUrl } = await api(`https://api.vagabonds.cloud/connect`, {
            method: 'GET',
        })

        setUrl(qrCodeUrl)
        setSession(data)
        toggleModal()
    }

    const toggleModal = () => {
        setModalState(!showModal);
    };

    useEffect(() => {
        if (cookies) {
            console.log(cookies)
        }
    }, [cookies])


    const removeSession = async () => {
        removeCookie('vagaSession');
        router.replace(router.asPath)
    }

    const createNewSession = async (data) => {
        const blob = {
            type: 'payment',
            account: session?.account,
            amount: data.amount.toString(),
            node: 'https://rpc.vaga.network:443',
            flag: 1,
            memo: 'Payment',
            to: data.to
        }

        const res = await api(`/api/vagachain/session`, {
            method: 'POST',
            body: {
                blob,
            }
        });
        if (res.status === 200) {
            setGatewayURL(res.data.gatewayURL)
        } else {
            console.log("Method not allowed")
        }
    }


    return (
        <div className="mx-auto h-screen w-full mt-80">
            <div className="my-10 flex justify-center">
                <Image src="/android-chrome-192x192.png" width={50} height={50} alt="" />
            </div>
            <div className=" flex justify-center items-center">
                <div className="w-[450px] rounded-xl  shadow">
                    <div className="bg-red-600 rounded-t-xl p-4">
                        <p className="text-sm font-bold text-white">Create Payload</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="p-4">
                            <div className="my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="amount"
                                        id="amount"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                label="Amount *"
                                                {...field}

                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.amount?.type === 'required' && <p role="alert">Amount is required</p>}</div>

                                </div>
                            </div>

                            <div className="my-10">
                                <div className="mt-1">
                                    <Controller
                                        name="to"
                                        id="to"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                label="Recipient *"
                                                {...field}

                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.to?.type === 'required' && <p role="alert">Recipient is required</p>}</div>

                                </div>
                            </div>
                        </div>

                        {session?.account ?
                            <div className="flex gap-4">
                                <div className="py-4 w-full px-4 flex justify-start ">
                                    <Button className="bg-red-600 text-white hover:bg-red-500" onClick={() => removeSession()}>Destroy Session</Button>
                                </div>
                                <div className="py-4 w-full px-4 flex justify-end ">
                                    <Button type="submit" className="bg-red-600 text-white hover:bg-red-500">Create</Button>
                                </div>
                            </div>
                            :
                            <div className="py-4 w-full px-4 flex justify-end ">
                                <Button onClick={() => getSession()} className="bg-red-600 text-white hover:bg-red-500">Connect</Button>
                            </div>
                        }
                    </form>
                    <p className="text-xs px-4 my-4 w-full text-center ">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                            {session?.account ? session?.account : 'Not Connected'}
                        </span>
                    </p>
                </div>
            </div>
            {gatewayURL &&
                <div className="w-full my-6 flex justify-center">
                    <a href={gatewayURL} target="_blank" rel="noreferrer">
                        <Button className="bg-gray-600 text-white hover:bg-red-500">
                            Pay Slip
                        </Button>
                    </a>
                </div>
            }
            {
                sessionData.session &&
                <Modal
                    show={showModal}
                    title="Scan to Connect"
                    toggle={toggleModal}
                    url={url}
                    address={sessionData.account}
                    session={sessionData.session}
                >
                </Modal>
            }

        </div >
    );
}

export async function getServerSideProps({ req, res }) {

    const cookies = req.cookies.vagaSession

    const verified = await api(`https://api.vagabonds.cloud/verifySession`, {
        method: 'POST',
        body: {
            session: cookies
        }
    })

    const session = await api(`https://api.vagabonds.cloud/getSign`, {
        method: 'POST',
        body: {
            session: cookies
        }
    })
    console.log(req.cookies.vagaSession)


    return {
        props: {
            cookies: cookies ? JSON.parse(JSON.stringify(cookies)) : null,
            session: !session?.error ? JSON.parse(JSON.stringify(session.data)) : null,

        }
    }
}
