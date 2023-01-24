import React from 'react'
import Chat from '@/components/modules/ai-cloud/Chat'
import { AccountLayout } from '@/layouts/index';
import Meta from '@/components/Meta/index';
import Content from '@/components/Content/index';
import { getSession } from 'next-auth/react';


function AICloud({ session }) {
    console.log(session)
    return (
        <AccountLayout footer={true}>
            <Meta title={`Vagabond - Contacts | Dashboard`} />
            <Content.Title
                title="Vagabond AI Cloud"
                subtitle="Vagabond Assistant"
            />
            <Content.Divider />
            <Content.Container>
                <div className=" w-full px-10">
                    <Chat name={!session.user.name ? session.user.email : session.user.name} />
                </div>
            </Content.Container>
        </AccountLayout>
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