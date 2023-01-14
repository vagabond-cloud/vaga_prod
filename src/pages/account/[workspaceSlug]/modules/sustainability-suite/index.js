import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import Reload from '@/components/Reload';
import { AccountLayout } from '@/layouts/index';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { items } from '@/config/modules/items'
import Link from 'next/link'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



function SustainabilitySuite() {
    const router = useRouter();
    const { workspaceSlug } = router.query;

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Modules | Dashboard`} />
            <Content.Title
                title="Create Module"
                subtitle="Modules overview and creation"
            />
            <Content.Divider />
            <Content.Container>
                Commerce Cloud
            </Content.Container>
        </AccountLayout >
    )
}

export default SustainabilitySuite