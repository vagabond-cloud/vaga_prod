import { useState, useRef } from 'react'
import { useFieldArray, useForm, useWatch, Controller } from "react-hook-form";
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'
import { grandTotal } from '@/lib/client/modules/customer-cloud/invoiceTotal'
import { countries } from '@/config/common/countries'
import api from '@/lib/common/api'

function Quotes({ settings, deal }) {
    settings = JSON.parse(settings)[0]

    const id = () => Math.random().toString(36).substr(2, 9);
    const [client, setClient] = useState("");


    const getAddress = (ident) => {
        if (ident) {
            const address = deal.contact.id === ident ? deal.contact : deal.company;
            return {
                street: address.street,
                zip: address.zip,
                city: address.city,
                country: address.country
            }
        }
    }

    const defaultValues = {
        clientName: '',
        quoteNumber: '',
        street: getAddress(client)?.street || '',
        clientId: '',
        zip: getAddress(client)?.zip || '',
        city: getAddress(client)?.city || '',
        quoteDate: '',
        country: countries.find((c) => c.code === getAddress(client)?.name),
        validUntil: '',
        subject: '',
        intro: '',
        item: [{
            name: '',
            amount: '',
            price: '',
            vat: settings.vat || '',
            discount: '',
        }],
        footer: '',
        note: '',
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

        const amount = parseFloat(item.amount) || 0;
        const price = parseFloat(item.price) || 0;
        const vat = parseFloat(item.vat) || settings.vat || 0;
        const discount = parseFloat(item.discount) || 0;

        const itemTotal = (amount * price) + (amount * price * vat / 100) - discount;

        return parseFloat(itemTotal).toLocaleString(settings.country, { style: 'currency', currency: settings.currency });
    };

    const saveQuote = async (formInput) => {
        const res = await api(`/api/modules/customer-cloud/quote`, {
            method: 'POST',
            body: {
                formInput
            }
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    <div className="grid grid-cols-3 gap-4 rounded-lg shadow px-2 py-4">
                        <p className="px-4 font-bold my-4 col-span-3">Client Information</p>

                        <div className="px-4 my-0 col-span-2">
                            <Controller
                                name="clientName"
                                id="clientName"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
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
                                        value={field.value}
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
                                        id: id(),
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
                    <Button
                        type="submit"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create
                    </Button>
                </div>
            </form >

        </div >
    )
}

export default Quotes



