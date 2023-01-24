import { CalendarIcon, CommandLineIcon, MegaphoneIcon, ShoppingBagIcon, IdentificationIcon, UserGroupIcon, GlobeEuropeAfricaIcon, HeartIcon } from '@heroicons/react/24/outline'


export const types = [
    {
        name: 'Product Pass',
        description: 'A product pass is a module that allows you to sell a product or service to your customers.',
        type: 'product-pass',
        icon: <IdentificationIcon className="w-6 h-6 " />,
        bgColor: 'bg-red-600',
    },
    {
        name: 'Commerce Cloud',
        description: 'A commerce cloud is a module that allows you to sell a product or service to your customers.',
        type: 'commerce-cloud',
        icon: <ShoppingBagIcon className="w-6 h-6 " />,
        bgColor: 'bg-teal-600',

    },
    {
        name: 'Customer Cloud',
        description: 'A customer cloud is a module that allows you to sell a product or service to your customers.',
        type: 'customer-cloud',
        icon: <UserGroupIcon className="w-6 h-6 " />,
        bgColor: 'bg-indigo-600',

    },
    {
        name: 'Sustainability Suite',
        description: 'A sustainability suite is a module that allows you to sell a product or service to your customers.',
        type: 'sustainability-suite',
        icon: <GlobeEuropeAfricaIcon className="w-6 h-6 " />,
        bgColor: 'bg-red-600',


    },
    {
        name: 'CX Management',
        description: 'A CX management is a module that allows you to sell a product or service to your customers.',
        type: 'cx-management',
        icon: <HeartIcon className="w-6 h-6 " />,
        bgColor: 'bg-purple-600',
    },
    {
        name: 'AI Cloud',
        description: 'A AI cloud is a module that allows you to sell a product or service to your customers.',
        type: 'ai-cloud',
        icon: <MegaphoneIcon className="w-6 h-6 " />,
        bgColor: 'bg-stone-600',
    },
]