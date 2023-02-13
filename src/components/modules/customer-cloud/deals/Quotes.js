import Select from '@/components/Select';
import api from '@/lib/common/api';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import Button from '@/components/Button';

function Quotes({ settings, deal }) {
    settings = JSON.parse(settings)[0]
    const router = useRouter()
    const { workspaceSlug, id } = router.query
    const [quotes, setQuotes] = useState([])
    const [category, setCategory] = useState('quote')

    const defaultValues = {
        category: '',
    }

    const { register, setValue, control, formState: { errors, touchedFields } } = useForm({ defaultValues });
    const onSubmit = data => console.log(data);


    useEffect(() => {
        if (id) {
            getQuotes()
        }
    }, [id, category])


    const getQuotes = async () => {
        try {
            const res = await api(`/api/modules/customer-cloud/${category}?dealId=${id}&all=1`, {
                method: 'GET'
            });

            setQuotes(res.quote);
        } catch (err) {
            console.error("Error in getQuotes:", err);
        }
    };

    const handleCategory = ({ target: { value } }) => {

        setCategory(value)
    };

    return (
        <>
            <div className="flex justify-between gap-4 items-center">
                <div className="w-full px-4">
                    <p className="text-lg text-gray-800">{category === "quote" ? "Quotes" : "Invoices"}</p>
                </div>
                <div className="w-80 flex gap-4">
                    <div className="px-4 w-60 my-0 col-span-1">
                        <Controller
                            name="quoteStatus"
                            id="quoteStatus"
                            control={control}
                            rules={{ required: true }}
                            render={({ field, fieldState, formState }) => (
                                <Select

                                    {...field}
                                    label="Status"
                                    onChange={(e) => {
                                        field.onChange(e),
                                            setValue('quoteStatus', e.target.value)
                                        handleCategory(e)
                                    }}
                                >
                                    <option value="quote">Quotes</option>
                                    <option value="invoice">Invoices</option>
                                </Select>
                            )}

                        />
                    </div>
                    <div className="mt-6">
                        <Button className="bg-red-600 text-white" onClick={() => router.push(`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${category}/new/${id}`)} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /></svg>
                        </Button>
                    </div>
                </div>
            </div>
            {
                category.length > 0 ?
                    <div className="w-full px-4 mt-10">
                        {quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                            <Link href={`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${category}/${item.id}/${deal.id}`} key={index} className="">
                                <div className="p-4 cursor-pointer pointer-events-auto w-full max-w-full overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100">
                                    <div className="flex items-between">
                                        <div className="ml-3 w-0 flex-1 pt-0.5">
                                            <p className="text-sm font-medium text-gray-900">{deal?.contact?.id === item.clientId ? deal?.contact?.firstName + ' ' + deal?.contact?.lastName : deal?.company?.companyName} </p>
                                            <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.item.reduce((a, b) => a + parseFloat((b.price * b.amount) + (b.price * b.amount * b.vat / 100) - parseFloat(b.discount)), 0)?.toLocaleString(settings.country, { style: 'currency', currency: settings.currency })}</p>
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
                            </Link>
                        ))}
                    </div>
                    :
                    category.length === 0 ?
                        <div className="w-full h-full items-center p-4">
                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                        :
                        <div className="w-full h-full items-center p-4">
                            No quotes found
                        </div>
            }
        </>
    )
}

export default Quotes