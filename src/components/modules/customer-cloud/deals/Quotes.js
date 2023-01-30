import { useState, useRef } from 'react'
import { useFieldArray, useForm, useWatch, Controller } from "react-hook-form";
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'
import FilesDiscovery from '@hubspot/api-client/lib/src/discovery/files/FilesDiscovery';

function Quotes({ settings }) {
    settings = JSON.parse(settings)[0]
    console.log(settings)
    const id = () => Math.random().toString(36).substr(2, 9);


    const defaultValues = {
        clientName: "",
        quoteId: "",
        street: "",
        clientId: "",
        zip: "",
        city: "",
        date: "",
        country: "",
        validUntil: "",
        subject: "",
        intro: "",
        item: [{
            id: id(),
            name: '',
            item: '',
            amount: '',
            price: '',
            vat: '',
            discount: '',
            total: '',
        }]
    };

    const { register, getValues, watch, handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => console.log(data);

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

    console.log("FILEDS", calcItems)

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    <div className="grid grid-cols-3 gap-4 rounded-lg shadow px-2 py-4">
                        <div className="px-4 my-0">
                            <Controller
                                name="clientName"
                                id="clientName"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Client"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </Select>
                                )}
                            />
                        </div>
                        <div />
                        <div className="px-4 my-0">
                            <Controller
                                name="quoteId"
                                id="quoteId"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Quote Number"
                                    />
                                )}
                            />
                        </div>
                        <div className="px-4 my-0">
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
                        <div />
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
                        <div className="grid grid-cols-3 gap-4">
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
                        <div />
                        <div className="px-4 my-0">
                            <Controller
                                name="date"
                                id="date"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Date"
                                    />
                                )}
                            />
                        </div>
                        <div className="px-4 my-0">
                            <Controller
                                name="country"
                                id="country"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Country"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </Select>
                                )}
                            />
                        </div>
                        <div />
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

                    <div className="grid grid-cols-1 gap-4 rounded-lg shadow px-2 py-4 mt-10">
                        <div className="grid grid-cols-9 gap-2 text-sm">
                            <div className="px-4 my-0 col-span-3">
                                Product/Service
                            </div>
                            <div className="px-4 my-0 col-span-1">
                                Amount
                            </div>
                            <div className="px-4 my-0 col-span-1">
                                Price ({settings.currency})
                            </div>
                            <div className="px-4 my-0 col-span-1">
                                VAT
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
                                <section key={field.id} className="grid grid-cols-9 gap-2">
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
                                                    placeholder={`item.${index}.name`}
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
                                                    type="number"
                                                    placeholder="0%"
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
                                    <div className="px-4 my-0 col-span-1">
                                        <Controller
                                            name={`item.${index}.discount`}
                                            id={`item.${index}.discount`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder={parseFloat((calcItems[index]?.amount ? parseFloat(calcItems[index]?.amount) : 0 * parseFloat(calcItems[index]?.price))
                                                        - (calcItems[index]?.discount ? parseFloat(calcItems[index]?.discount) : 0
                                                        )).toLocaleString(settings.country, { style: 'currency', currency: settings.currency })}
                                                />
                                            )}
                                        />
                                    </div>
                                    {/* <div className="px-4 my-4 col-span-1 font-bold">
                                        {parseFloat((calcItems[index]?.amount ? parseFloat(calcItems[index]?.amount) : 0 * calcItems[index]?.price ? parseFloat(calcItems[index]?.price) : 0)
                                            - (calcItems[index]?.discount ? parseFloat(calcItems[index]?.discount) : 0
                                            )).toLocaleString(settings.country, { style: 'currency', currency: settings.currency })}
                                    </div> */}
                                    <Button type="button" className="bg-red-600 text-white mt-1 w-16" onClick={() => remove(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                        </svg>
                                    </Button>
                                </section>
                            );
                        })}
                        <div className="flex flex-row px-4">
                            <TotalAmout control={control} />
                        </div>
                        <section className="px-4">
                            <Button
                                className="bg-red-600 text-white hover:bg-red-700"
                                type="button"
                                onClick={() => {
                                    append({
                                        id: id(),
                                        name: "",
                                        amount: 1
                                    });
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                </svg>
                            </Button>
                        </section>
                    </div>
                </div>
                <div className="mt-10">
                    <Button
                        type="submit"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Save
                    </Button>
                </div>
                {/* <section>
                    <button
                        type="button"
                        onClick={() => {
                            append();
                        }}
                    >
                        append
                    </button>
                    <button type="button" onClick={() => prepend()}>
                        prepend
                    </button>
                    <input name="at" ref={register} placeholder="Insert index" />
                    <button type="button" onClick={() => insert(parseInt(at, 10))}>
                        insert at
                    </button>
                </section> */}
            </form >

        </div >
    )
}

export default Quotes



function getTotal(payload) {
    let total = 0;

    for (const item of payload) {
        total = total + (Number.isNaN(item.amount) ? 0 : item.amount);
    }

    return total;
}

function TotalAmout({ control }) {
    const cartValues = useWatch({
        control,
        name: "item"
    });

    return <p>{getTotal(cartValues)}</p>;
}