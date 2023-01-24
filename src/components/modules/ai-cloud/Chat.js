import { useEffect, useState, useRef, Fragment } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ChatLine, { Message, LoadingChatLine } from './ChatLine'
import { useCookies } from 'react-cookie'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

const COOKIE_NAME = 'vaga-ai chat'

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages = [
    {
        who: 'bot',
        message: 'Hi! I’m A Vaga AI. Ask me anything!',
    },
]

const InputMessage = ({ input, setInput, sendMessage }) => (
    <div className="-py-10 flex clear-both">
        <Input
            type="text"
            aria-label="chat input"
            required
            value={input}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    sendMessage(input)
                    setInput('')
                }
            }}
            onChange={(e) => {
                setInput(e.target.value)
            }}
        />
        <Button
            className="ml-4 flex-none"
            onClick={() => {
                sendMessage(input)
                setInput('')
            }}
        >
            <PaperAirplaneIcon className="w-6 h-6 text-gray-500 hover:text-red-600 " />
        </Button>
    </div>
)

function Chat({ name }) {
    const [messages, setMessages] = useState(initialMessages)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [cookie, setCookie] = useCookies([COOKIE_NAME])

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }


    useEffect(() => {
        if (!cookie[COOKIE_NAME]) {
            // generate a semi random short id
            const randomId = Math.random().toString(36).substring(7)
            setCookie(COOKIE_NAME, randomId)
        }
    }, [cookie, setCookie])

    // send message to API /api/chat endpoint
    const sendMessage = async (message) => {
        setLoading(true)
        const newMessages = [
            ...messages,
            { message, who: 'user' },
        ]
        setMessages(newMessages)
        const last10messages = newMessages.slice(-10)


        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: last10messages,
                user: cookie[COOKIE_NAME],
            })
        })
        const data = await response.json();

        // strip out white spaces from the bot message
        const botNewMessage = data.text.trim();
        scrollToBottom();

        setMessages([
            ...newMessages,
            { message: botNewMessage, who: 'bot' }
        ]);
        scrollToBottom();
        setLoading(false);

    }

    return (
        <>
            <div className="rounded-2xl border-zinc-100">
                <div className="h-full mb-20">
                    {messages.map(({ message, who }, index) => {
                        return (
                            <div key={index} className="" >
                                <ChatLine key={index} who={who} message={message} name={name} />

                            </div>
                        )
                    })}

                </div>
                {loading &&
                    <>
                        <LoadingChatLine />
                        <div ref={messagesEndRef} className="min-h-20 mb-96" />

                    </>
                }
            </div>
            <div className="fixed bottom-0 right-0 md:w-4/5 xs:w-full p-4 mt-4  bg-white">
                <InputMessage
                    input={input}
                    setInput={setInput}
                    sendMessage={sendMessage}
                    placeholder={messages.length < 2 && "Type a message to start the conversation"}
                />
            </div>
            <div ref={messagesEndRef} className="min-h-20 mb-96" />

        </>
    );

}

export default Chat