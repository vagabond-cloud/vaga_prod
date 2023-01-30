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
        message: `Hi! I’m A Vaga AI. Ask me anything!`,
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
            className="ml-2 mt-1 flex-none bg-red-600 hover:bg-gray-200 hover:text-gray-800 text-gray-100"
            onClick={() => {
                sendMessage(input)
                setInput('')
            }}
        >
            <div className=" ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                </svg>
            </div>
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
        scrollToBottom();
        console.log(messagesEndRef.current)
    }, [messages, loading]);

    useEffect(() => {
        if (!cookie[COOKIE_NAME]) {
            // generate a semi random short id
            const randomId = Math.random().toString(36).substring(7)
            setCookie(COOKIE_NAME, randomId)
        }
    }, [cookie, setCookie])

    // send message to API /api/chat endpoint
    const sendMessage = async (message) => {
        setLoading(true);

        const newMessages = [...messages, { message, who: "user" }];
        setMessages(newMessages);

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: [...newMessages.slice(-10), { message, who: "user" }],
                user: cookie[COOKIE_NAME],
            }),
        });
        const { text } = await response.json();
        const botNewMessage = text.trim();

        setMessages([...newMessages, { message: botNewMessage, who: "bot" }]);
        scrollToBottom();
        setLoading(false);
    };


    return (
        <div className="relative h-full  px-8">
            <div className="rounded-2xl border-zinc-100 h-5/6 overflow-y-scroll overscroll-none px-8 mb-10 scroll-hidden ">
                <div className="my-8 ">
                    {messages.map(({ message, who }, index) => {
                        return (
                            <div key={index} className="py-10 " >
                                <ChatLine key={index} who={who} message={message} name={name} />
                                <div style={{ marginBottom: 50 }} ref={messagesEndRef} />

                            </div>
                        )
                    })}

                </div>
                {loading &&
                    <>
                        <LoadingChatLine />

                    </>
                }
            </div>

            <div className="relative bottom-0 right-0 h-[10%]  xs:w-full p-4 mt-4  bg-white">
                <InputMessage
                    input={input}
                    setInput={setInput}
                    sendMessage={sendMessage}
                    placeholder={messages.length < 2 && "Type a message to start the conversation"}
                />
            </div>

        </div>
    );

}

export default Chat