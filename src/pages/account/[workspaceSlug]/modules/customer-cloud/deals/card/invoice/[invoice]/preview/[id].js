import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AccountLayout } from '@/layouts/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { getSession } from 'next-auth/react';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { getDeal, getInvoice, getCRMSettings } from '@/prisma/services/modules'
const InvoicePDF = dynamic(() => import('./pdf'), { ssr: false });


const View = ({ settings, deal, invoice }) => {

    settings = JSON.parse(settings)[0]
    deal = JSON.parse(deal)
    invoice = JSON.parse(invoice)[0]


    const [client, setClient] = useState(false);
    useEffect(() => {
        // fetch client data
        setClient(true);
    }, [])

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Settings | Dashboard`} />
            <Content.Title
                title="Invoice"
                subtitle={`Preview of Invoice ${invoice.id}`}
            />
            <Content.Divider />
            <Content.Container>
                <InvoicePDF client={client} invoice={invoice} deal={deal} settings={settings} />
            </Content.Container>
        </AccountLayout>
    )
}

export default View


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
    let invoice = null
    if (context.params.invoice !== 'new') {
        invoice = await getInvoice(context.params.invoice, context.params.id)
    } else {
        invoice = []
    }

    return {
        props: {
            deal: JSON.stringify(deal),
            workspace: JSON.stringify(workspace),
            settings: JSON.stringify(settings),
            invoice: JSON.stringify(invoice),

        }
    }
}

