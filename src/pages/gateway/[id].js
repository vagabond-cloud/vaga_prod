import Gateways from '@/components/Gateway'
import api from '@/lib/common/api'
import { getSession } from '@/prisma/services/gateway';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Gate({ data, session }) {

    return (
        <div>
            <Gateways image={data} session={session} />
        </div>
    );
}

export async function getServerSideProps(context) {

    const vagaSession = await getSession(context.query.id)

    const { data } = await api(`https://api.vagabonds.cloud/qrcode`, {
        method: 'POST',
        body: {
            session: vagaSession.session,
        }
    })

    return {
        props: {
            data: data,
            session: JSON.parse(JSON.stringify(vagaSession))
        }
    }
}
