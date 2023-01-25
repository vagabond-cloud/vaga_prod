import { useState, useEffect } from 'react'
import api from '@/lib/common/api'
import { getAllUsers, searchUsers } from '@/prisma/services/user'
import { useRouter } from 'next/router'
import AdminLayout from '@/layouts/AdminLayout'
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';

function Users({ users, total }) {

    const router = useRouter()
    const { page } = router.query

    const [allUsers, setAllUsers] = useState(users)
    const [prompt, setPrompt] = useState('')

    const handlePageChange = (pageNumber) => {
        router.replace(`/admin/users?page=${pageNumber}`)
    }

    const handleSearch = () => {
        router.replace(`/admin/users?prompt=${prompt}`)
    }

    console.log(users)

    return (
        <AdminLayout>
            <Content.Container>
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="my-4 pb-8 flex gap-4">
                        <Input
                            type="text"
                            placeholder="Search users"
                            className="w-full"
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <Button onClick={() => handleSearch()} className="bg-red-600 text-white">Search</Button>
                    </div>
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the users in your account including their name, title, email and role.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                            >
                                Add user
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Active
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Subscription
                                                </th>

                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Role
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {users.map((user) => (
                                                <tr key={user.email}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                {!user.photo_url ?
                                                                    <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                                                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                                        </svg>
                                                                    </span>

                                                                    :
                                                                    <img className="h-10 w-10 rounded-full" src={user.photo_url} alt="" />
                                                                }
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div className="text-gray-900">{user.email}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                            {!user.active || user.active ?
                                                                "Active"
                                                                :
                                                                "Inactive"
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.userCode}</td>

                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.role?.toUpperCase()}</td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <a href="#" className="text-red-600 hover:text-red-900">
                                                            Edit<span className="sr-only">, {user.name}</span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Content.Container>
        </AdminLayout>

    )
}

export default Users


export const getServerSideProps = async (context) => {
    const { page, prompt } = context.query

    const admin = await getAllUsers(!page ? 1 : page, 10, { id: 'asc' });
    const search = await searchUsers(prompt, 1, 10, { id: 'asc' })

    return {
        props: {
            users: prompt ? search : admin.users,
            total: admin.total,
        },
    };
};