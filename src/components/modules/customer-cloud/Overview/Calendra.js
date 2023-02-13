import { Fragment } from 'react'
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
    MapPinIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import moment from 'moment'
import { useState } from 'react'
import { useRouter } from 'next/router'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example({ deals }) {

    const router = useRouter()
    const { workspaceSlug, id } = router.query
    const [month, setMonth] = useState(-1);

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    let currentMonth = today.getMonth() + 1; // get the current month
    let currentYear = today.getFullYear(); // get the current year
    let currentDate = new Date(firstDay).getDate(); // get the current date


    const meetings = deals.map((deal, index) => {
        return ({
            id: deal.id,
            date: moment(deal.closeDate).format("MMMM Do, YYYY"),
            time: '12:00 AM',
            datetime: deal.closeDate,
            name: deal.dealName,
            imageUrl:
                deal?.contact?.photoUrl ? deal.contact.photoUrl : "https://media.istockphoto.com/id/1311285048/vector/avatar-m.jpg?s=612x612&w=0&k=20&c=pZcHWIXApiqHoMZ9ray_V6gaEwjqv5zXrNdqJkGfXbQ=",
            location: 'Headquarters',
        })
    })


    const days = []; // create an empty array

    // iterate over the next 31 days
    for (let i = 1; i < 36; i++) {
        const dateObj = new Date(currentYear, currentMonth + month, currentDate + i); // create a date object with array values of current year and month and one extra day after each iteration of loop
        const dayObject = { // create an object for days
            date: dateObj.toISOString().split("T")[0] // iso string of date object
        };
        if (dateObj.getMonth() + 1 === currentMonth) { // check if month is current
            dayObject.isCurrentMonth = true; // add isCurrentMonth to object
            if (dateObj.getDate() === today.getDate() + 1) { // check if date is today's date
                dayObject.isToday = true; // add isToday to object
                if (dateObj.getDate() === currentDate) { // check if date is selected date
                    dayObject.isSelected = true; // add isSelected to object
                }
            }
        }
        days.push(dayObject); // push the current dayObject in days array
    }

    if (currentMonth === 11) {
        // Increase the year by one
        currentYear += 1;
        // Reset month 
        currentMonth = 0;
    }
    // Update our current date and time
    currentDate = new Date(currentYear, currentMonth + month, currentDate);
    // Format Month
    let month_name = moment(currentDate).format("MMMM YYYY");


    const overlay = (date) => {
        const dealId = meetings.find((d) => new Date(d.datetime).getDate() === new Date(date).getDate() && new Date(d.datetime).getFullYear() === new Date(date).getFullYear() && new Date(d.datetime).getMonth() === new Date(date).getMonth()).id

        router.push(`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${dealId}`)
    }

    return (
        <div>
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
                <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
                    <div className="flex items-center text-gray-900">
                        <button onClick={() => setMonth(month - 1)} className="text-gray-400 hover:text-gray-500">

                            <span className="sr-only">Previous month</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <div className="flex-auto font-semibold">{month_name}</div>
                        <button onClick={() => setMonth(month + 1)} className="text-gray-400 hover:text-gray-500">

                            <span className="sr-only">Next month</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                        <div>S</div>
                    </div>
                    <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                        {days.map((day, dayIdx) => {

                            return (
                                <button
                                    key={day.date}
                                    type="button"
                                    className={classNames(
                                        'py-1.5 hover:bg-gray-100 focus:z-10',
                                        day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                                        (day.isSelected || day.isToday) && 'font-semibold',
                                        day.isSelected && 'text-white',
                                        !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                                        !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400',
                                        day.isToday && !day.isSelected && 'text-red-600',
                                        dayIdx === 0 && 'rounded-tl-lg',
                                        dayIdx === 6 && 'rounded-tr-lg',
                                        dayIdx === days.length - 7 && 'rounded-bl-lg',
                                        dayIdx === days.length - 1 && 'rounded-br-lg'
                                    )}
                                    onClick={() => { meetings.some((d) => new Date(d.datetime).getDate() === new Date(day.date).getDate() && new Date(d.datetime).getFullYear() === new Date(day.date).getFullYear() && new Date(d.datetime).getMonth() === new Date(day.date).getMonth()) && overlay(day.date) }}
                                >
                                    <time
                                        dateTime={day.date}
                                        className={classNames(
                                            'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                                            day.isSelected && day.isToday && 'bg-red-600',
                                            day.isSelected && !day.isToday && 'bg-gray-900',
                                            meetings.some((d) => new Date(d.datetime).getDate() === new Date(day.date).getDate() && new Date(d.datetime).getFullYear() === new Date(day.date).getFullYear() && new Date(d.datetime).getMonth() === new Date(day.date).getMonth()) && 'bg-red-600 text-white',
                                        )}>
                                        {day.date.split('-').pop().replace(/^0/, '')}
                                    </time>
                                </button>


                            )
                        })}
                    </div>

                </div>
                <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                    {meetings
                        .filter((m) => new Date(m.datetime).getTime() > today)
                        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
                        .slice(0, 3).map((meeting, index) => (

                            <li key={index} className="relative flex space-x-6 py-6 xl:static hover:bg-gray-100 px-2">
                                <img src={meeting.imageUrl} alt="" className="h-14 w-14 flex-none rounded-full" />
                                <div className="flex-auto">
                                    <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">{meeting.name}</h3>
                                    <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                                        <div className="flex items-start space-x-3">
                                            <dt className="mt-0.5">
                                                <span className="sr-only">Date</span>
                                                <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </dt>
                                            <dd>
                                                <time dateTime={meeting.datetime}>
                                                    {meeting.date}
                                                </time>
                                            </dd>
                                        </div>
                                        <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                                            <dt className="mt-0.5">
                                                <span className="sr-only">Location</span>
                                                <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </dt>
                                            <dd>{meeting.location}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <Menu as="div" className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center">
                                    <div>
                                        <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                                            <span className="sr-only">Open options</span>
                                            <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href={`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${meeting.id}`}
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Edit
                                                        </a>
                                                    )}
                                                </Menu.Item>

                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </li>
                        ))}
                </ol>
            </div>
        </div>
    )
}
