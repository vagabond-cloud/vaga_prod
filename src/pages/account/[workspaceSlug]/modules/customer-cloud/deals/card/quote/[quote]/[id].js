import { useState, useRef } from 'react'
import { useFieldArray, useForm, useWatch, Controller } from "react-hook-form";
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'
import { grandTotal } from '@/lib/client/modules/customer-cloud/invoiceTotal'
import { countries } from '@/config/common/countries'
import api from '@/lib/common/api'
import { getSession } from 'next-auth/react';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { getDeal, getQuote, getCRMSettings } from '@/prisma/services/modules';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { AccountLayout } from '@/layouts/index';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { contactActivity } from '@/lib/client/log';

function Quotes({ settings, deal, quote }) {
    settings = JSON.parse(settings)[0]
    deal = JSON.parse(deal)
    quote = JSON.parse(quote)[0]

    const router = useRouter()
    const { workspaceSlug, id } = router.query

    //create unique id for each item
    const createId = () => {
        return Math.random().toString(36).substr(2, 9);
    }
    const [client, setClient] = useState("");


    const getAddress = (ident) => {
        if (!ident) return {};
        const address = deal.contact.id === ident ? deal.contact : deal.company;
        return {
            street: address.street,
            zip: address.zip,
            city: address.city,
            country: address.country
        }
    };

    const defaultValues = {
        clientName: quote?.clientName || '',
        quoteNumber: quote?.quoteNumber || '',
        dealId: id,
        street: getAddress(quote?.clientId ? quote?.clientId : client)?.street || '',
        clientId: quote?.clientId || '',
        quoteStatus: quote?.quoteStatus || '',
        zip: getAddress(quote?.clientId ? quote?.clientId : client)?.zip || '',
        city: getAddress(quote?.clientId ? quote?.clientId : client)?.city || '',
        quoteDate: quote?.quoteDate || '',
        country: countries.find((c) => c.code === getAddress(quote?.clientId ? quote?.clientId : client)?.name),
        validUntil: quote?.validUntil || '',
        subject: quote?.subject || '',
        intro: quote?.intro || '',
        item: quote?.item ? quote?.item : [{
            name: '',
            amount: '',
            price: '',
            vat: settings.vat || '',
            discount: '',
        }],
        footer: quote?.footer || '',
        note: quote?.note || '',
        moduleid: deal.module.id
    };



    const { register, setValue, getValues, watch, handleSubmit, control, formState: { errors, touchedFields } } = useForm({ defaultValues });
    const onSubmit = data => saveQuote(data);

    const { fields, append, prepend, remove } = useFieldArray({
        name: "item",
        control,
        rules: {
            required: "Please append at least 1 item"
        }
    });

    const calcItems = useWatch({
        control,
        name: "item"
    })

    // Calculate the total price of each item row
    const total = (index) => {
        const item = calcItems[index];
        if (!item) return 0;
        const amount = item.amount ? parseFloat(item.amount) : 0;
        const price = item.price ? parseFloat(item.price) : 0;
        const vat = item.vat ? parseFloat(item.vat) : (settings.vat || 0);
        const discount = item.discount ? parseFloat(item.discount) : 0;
        return (amount * price + (amount * price * vat / 100) - discount)
            .toLocaleString(settings.country, { style: 'currency', currency: settings.currency });
    };



    const saveQuote = async (formInput) => {
        const method = quote?.clientId ? 'PUT' : 'POST';
        const url = "/api/modules/customer-cloud/quote";
        const body = quote?.clientId
            ? { canUpdate: true, quoteId: quote.id, formInput }
            : { formInput };

        const res = await api(url, { method, body });
        !quote?.clientId ?
            await writeLog(`Quote for Client ${formInput.clientId} created`, "quote_created", new Date(), id)
            :
            await writeLog(`Quote for Client ${formInput.clientId} updated`, "quote_updated", new Date(), id)
        toast.success(quote?.clientId ? "Quote updated successfully" : "Quote created successfully");
        !quote?.clientId ?
            router.push(`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${id}?tab=quotes`)
            :
            null
    };

    const deleteInvoice = async () => {
        const method = 'DELETE';
        const url = `/api/modules/customer-cloud/quote?id=${quote.id}`;
        const res = await api(url, { method });
        toast.success("Invoice deleted successfully");
        await writeLog(`Quote for Client ${quote.clientId} deleted`, "quote_deleted", new Date(), id)
        router.push(`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${id}?tab=quotes`);
    };

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Deals | Dashboard`} />
            <Content.Title
                title="Quote"
                subtitle="Create a new quote for your client"
            />
            <Content.Divider />
            <Content.Container>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="">
                            <div className="grid grid-cols-3 gap-4 rounded-lg shadow px-2 py-4">
                                <p className={`px-4 font-bold my-4 ${quote?.clientId ? "col-span-2" : "col-span-3"}`}>Client Information</p>
                                {quote?.clientId && (
                                    <div className="px-4 my-0 col-span-1">
                                        <Controller
                                            name="quoteStatus"
                                            id="quoteStatus"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field, fieldState, formState }) => (
                                                <Select

                                                    {...field}
                                                    label="Status"
                                                >
                                                    <option value="draft">Draft</option>
                                                    <option value="sent">Sent</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="declined">Declined</option>
                                                </Select>
                                            )}

                                        />
                                    </div>
                                )}

                                <div className="px-4 my-0 col-span-2">
                                    <Controller
                                        name="clientName"
                                        id="clientName"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field, fieldState, formState }) => (
                                            <Select
                                                {...field}
                                                label="Client *"
                                                onChange={(e) => {
                                                    field.onChange(e),
                                                        setClient(e.target.value),
                                                        setValue('street', getAddress(e.target.value)?.street)
                                                    setValue('zip', getAddress(e.target.value)?.zip)
                                                    setValue('city', getAddress(e.target.value)?.city)
                                                    setValue('country', countries.find((c) => c.code === getAddress(e.target.value)?.country)?.name)
                                                    setValue('clientId', e.target.value)
                                                }}
                                                value={quote?.clientName ? quote?.clientName : field.value}
                                            >
                                                <option value="">Choose Client</option>

                                                {deal.contact &&
                                                    <option value={deal.contact.id}>{deal.contact.firstName + ' ' + deal.contact.lastName}</option>
                                                }
                                                {deal.company &&
                                                    <option value={deal.company.id}>{deal.company.companyName}</option>
                                                }
                                            </Select>
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.clientName?.type === 'required' && <p role="alert">Client is required</p>}</div>

                                </div>

                                <div className="px-4 my-0">
                                    <Controller
                                        name="quoteNumber"
                                        id="quoteNumber"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Quote Number"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-4 my-0 col-span-2">
                                    <Controller
                                        name="street"
                                        id="street"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Street"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-4 my-0">
                                    <Controller
                                        name="clientId"
                                        id="clientId"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Client ID"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4 col-span-2">
                                    <div className="px-4 my-0 col-span-1">
                                        <Controller
                                            name="zip"
                                            id="zip"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="ZIP"

                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="px-4 my-0 col-span-2">
                                        <Controller
                                            name="city"
                                            id="city"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="City"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-0">
                                    <Controller
                                        name="quoteDate"
                                        id="quoteDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Date"
                                                type="date"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-4 my-0 col-span-2">
                                    <Controller
                                        name="country"
                                        id="country"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Country"
                                                defaultValue={quote?.country ? quote?.country : field.value}
                                            >
                                                {countries.map((country, index) => (

                                                    <option key={index} defaultValue={country.code}>{country.name}</option>
                                                ))
                                                }
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="px-4 my-0">
                                    <Controller
                                        name="validUntil"
                                        id="validUntil"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                label="Valid Until (days)"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 rounded-lg shadow px-2 py-4 mt-10">
                                <p className="px-4 font-bold my-4 col-span-1">Header</p>

                                <div className="px-4 my-0">
                                    <Controller
                                        name="subject"
                                        id="subject"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="text"
                                                label="Subject"
                                            />
                                        )}
                                    />
                                </div>
                                <div />
                                <div className="px-4 my-0">
                                    <Controller
                                        name="intro"
                                        id="intro"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="text"
                                                label="Intro"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 rounded-lg shadow px-2 py-4 mt-10">
                                <div className="grid md:grid-cols-4 xs:grid-cols-1 lg:grid-cols-9 gap-2 text-xs">

                                    <div className="px-4 my-0 col-span-3">
                                        Product/Service
                                    </div>
                                    <div className="px-4 my-0 col-span-1">
                                        Amount
                                    </div>
                                    <div className="px-4 my-0 col-span-1 flex">
                                        Price <span className="md:hidden lg:flex ml-1">({settings.currency})</span>
                                    </div>
                                    <div className="px-4 my-0 col-span-1">
                                        VAT (%)
                                    </div>
                                    <div className="px-4 my-0 col-span-1">
                                        Discount
                                    </div>
                                    <div className="px-4 my-0 col-span-1">
                                        Total
                                    </div>
                                </div>
                                {fields.map((field, index) => {
                                    return (
                                        <section key={field.id} className="grid md:grid-cols-4 xs:grid-cols-1 lg:grid-cols-9 gap-1">
                                            <div className="px-4 my-0 col-span-3">
                                                <Controller
                                                    name={`item.${index}.name`}
                                                    id={`item.${index}.name`}
                                                    control={control}
                                                    rules={{ min: 0 }}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Product/Service"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="px-4 my-0 col-span-1">
                                                <Controller
                                                    name={`item.${index}.amount`}
                                                    id={`item.${index}.amount`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            placeholder="1"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="px-4 my-0 col-span-1">
                                                <Controller
                                                    name={`item.${index}.price`}
                                                    id={`item.${index}.price`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            placeholder="0,00"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="px-4 my-0 col-span-1">
                                                <Controller
                                                    name={`item.${index}.vat`}
                                                    id={`item.${index}.vat`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="px-4 my-0 col-span-1">
                                                <Controller
                                                    name={`item.${index}.discount`}
                                                    id={`item.${index}.discount`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            placeholder="0,00"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="px-4 my-4 col-span-1">
                                                <p className="text-end font-bold">{total(index)}</p>
                                            </div>

                                            <Button type="button" className="" onClick={() => remove(index)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                                </svg>
                                            </Button>
                                        </section>
                                    );
                                })}
                                <section className="grid grid-cols-9 gap-2 mt-4 border-t pt-6">
                                    <div className="px-4 col-span-6"></div>
                                    <div className="col-span-1">VAT</div>
                                    <p className="text-end pr-4 font-bold">{grandTotal(calcItems, settings).gradVat}</p>
                                </section>
                                <section className="grid grid-cols-9 gap-2 my-2">
                                    <div className="px-4 col-span-6"></div>
                                    <div className="col-span-1">Discount</div>
                                    <p className="text-end pr-4 font-bold">{grandTotal(calcItems, settings).grandDiscount}</p>
                                </section>
                                <section className="grid grid-cols-9 gap-2 my-2">
                                    <div className="px-4 col-span-6"></div>
                                    <div className="col-span-1">Total</div>
                                    <p className="text-end pr-4 font-bold">{grandTotal(calcItems, settings).grandTotal}</p>
                                </section>
                                <section className="px-4">
                                    <Button
                                        className="bg-red-600 text-white hover:bg-red-700"
                                        type="button"
                                        onClick={() => {
                                            append({
                                                id: createId(),
                                                name: "",
                                                amount: 1,
                                                price: "",
                                                vat: settings.vat,
                                                discount: "",
                                            });
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                        </svg>
                                    </Button>
                                </section>
                            </div>
                        </div >

                        <div className="grid grid-cols-1 gap-4 rounded-lg shadow px-2 py-4 mt-10">
                            <p className="px-4 font-bold my-4">Footer</p>
                            <div className="px-4 my-0">
                                <Controller
                                    name="footer"
                                    id="footer"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            label="Footer"
                                        />
                                    )}
                                />
                            </div>
                            <div />
                            <div className="px-4 my-0">
                                <Controller
                                    name="note"
                                    id="note"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            label="Note"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="mt-10 flex w-full justify-end">
                            {quote?.clientId ?
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-10"
                                        onClick={() => deleteInvoice()}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        type="button"
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => router.push(`/account/${workspaceSlug}/modules/customer-cloud/deals/card/quote/${quote.id}/preview/${id}`)}
                                    >
                                        Preview
                                    </Button>

                                </div>
                                :
                                <Button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Create
                                </Button>
                            }
                        </div>
                    </form >
                </div >
            </Content.Container >
        </AccountLayout >
    )
}

export default Quotes

export async function getServerSideProps(context) {

    const session = await getSession(context);

    //These two variables are initialized as false and null respectively. 
    //They are used to store whether the current user is a team owner and the current workspace.
    let isTeamOwner = false;
    let workspace = null;

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



    //This retrieves the module data using the getModule function and assigns it to the modules variable. 
    //It takes the id from the params property of the context object.
    const deal = await getDeal(context.params.id);

    const settings = await getCRMSettings(deal.module.id)
    let quote = null
    if (context.params.quote !== 'new') {
        quote = await getQuote(context.params.quote, context.params.id)
    } else {
        quote = []
    }

    return {
        props: {
            deal: JSON.stringify(deal),
            workspace: JSON.stringify(workspace),
            settings: JSON.stringify(settings),
            quote: JSON.stringify(quote),
        }
    }
}

const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}
