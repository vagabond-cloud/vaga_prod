import React from 'react'
import api from '@/lib/common/api'
import { useState } from 'react'

function Reports({ deal, settings }) {



    const [response, setResponse] = useState(null)
    const [submit, setSubmit] = useState(false)

    const prompt = settings.description + " erstelle nun ein Projekt Bericht für ein Projekt inkl. plannung, bau und service, Energiemanagementsystem" + deal.dealName + " mit einem Umsatz von " + deal.amount + "€. umgesetzt von dem Errichter " + deal.company.companyName + " zum " + deal.closeDate
    const ask = async () => {
        setSubmit(true)
        const res = await api(`/api/ai`, {
            method: 'POST',
            body: {
                prompt: prompt
            }
        })

        setResponse(res.data?.choices[0]?.text)
        setSubmit(false)
    }



    return (
        <div>
            <div>
                {submit ? <div className="bg-red-600 text-white px-4 py-2 rounded-md">Loading...</div> :
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => ask()}>Create Report</button>
                }
            </div>
            {response &&
                <div className="mt-10 ">
                    <div className="text-2xl font-bold my-4">{deal.dealName}</div>
                    <div>{response?.split('\n').map((str, index) => <p className={`my-4`} key={index}>{str}</p>)}</div>
                </div>
            }
        </div>
    )
}

export default Reports