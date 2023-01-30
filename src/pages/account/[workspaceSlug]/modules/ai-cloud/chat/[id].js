import React from 'react'
import Chat from '@/components/modules/ai-cloud/Chat'
import { AccountLayout } from '@/layouts/index';
import Meta from '@/components/Meta/index';
import Content from '@/components/Content/index';
import { getSession } from 'next-auth/react';


function AICloud({ session }) {

    return (
        <div className="h-screen p-10 ">
            <Content.Title
                title="Vagabond AI Cloud"
                subtitle="Vagabond Assistant"
            />
            <Content.Divider />
            <div className="py-8 h-full">
                <Chat name={!session.user.name ? session.user.email : session.user.name} />
            </div>
        </div>
    )
}

export default AICloud


export async function getServerSideProps(context) {

    const session = await getSession(context);

    return {
        props: {
            session
        }
    }
}