import Balancer from 'react-wrap-balancer'
import { DocumentDuplicateIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'

// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
const BalancerWrapper = (props) => <Balancer {...props} />

export const Message = {
    who: 'bot' | 'user' | undefined
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
    <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
        <div className="flex space-x-3 w-2xl">
            <div className="min-w-0 flex-1">

                <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
                        <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
                    </div>
                    <div className="h-2 rounded bg-zinc-500"></div>
                </div>
            </div>
        </div>
    </div>
)

// util helper to convert new lines to <br /> tags
const convertNewLines = (text) =>
    text.split('\n').map((line, i) => (
        <span key={i}>
            {line}
            <br />
        </span>
    ))

function ChatLine({ who = 'bot', message, name }) {
    if (!message) {
        return null
    }
    const formatteMessage = convertNewLines(message)

    return (
        <div
            className={
                who != 'bot' ? 'float-right clear-both' : 'float-left clear-both'
            }
        >
            <BalancerWrapper>

                <div className="float-right pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className=" bg-white px-4 py-5  sm:px-6">
                        <div className="flex space-x-3">
                            <div className="flex-1 gap-4">
                                <p className="text-xs font-medium text-gray-900">
                                    <a href="#" className="hover:underline text-xs">
                                        {who == 'bot' ? 'Vaga AI' : name}
                                    </a>
                                </p>
                                <p
                                    className={

                                        who == 'bot' ? 'mt-1 text-sm text-gray-500' : 'mt-1 text-sm text-gray-300'
                                    }
                                >
                                    {formatteMessage}
                                </p>
                                {who === 'bot' &&
                                    <p className="flex gap-4">
                                        <DocumentDuplicateIcon className="w-4 h-4 text-gray-500 mt-4 hover:text-red-600 cursor-pointer" />
                                        <ArrowUpOnSquareIcon className="w-4 h-4 text-gray-500 mt-4 hover:text-red-600 cursor-pointer" />
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                </div >
            </BalancerWrapper >
        </div >

    )
}

export default ChatLine