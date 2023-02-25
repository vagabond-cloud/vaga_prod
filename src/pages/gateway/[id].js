import Gateways from '@/components/Gateway'
import api from '@/lib/common/api'
import { getSession } from '@/prisma/services/gateway';

export default function Gate({ data, session }) {

    return (
        <div>
            <Gateways image={data} session={session} />
        </div>
    );
}

export async function getServerSideProps(context) {

    const vagaSession = await getSession(context.query.id)

    const { data } = await api(`${process.env.APP_URL}/api/system/qrcode`, {
        method: 'POST',
        body: {
            session: vagaSession.session,
            creator: vagaSession.account
        }
    })

    return {
        props: {
            data: data.url,
            session: JSON.parse(JSON.stringify(vagaSession))
        }
    }
}
