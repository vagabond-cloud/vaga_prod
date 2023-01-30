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
        <p className="animate-pulse py-2 px-4 w-auto text-sm bg-gray-200 rounded flex gap-2          ">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightbulb" viewBox="0 0 16 16">
                    <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z" />
                </svg>
            </span>
            Thinking...
        </p>
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
            <div className="my-4 float-right pointer-events-auto w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                                <BalancerWrapper>

                                    {formatteMessage}
                                </BalancerWrapper >

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
        </div >

    )
}

export default ChatLine