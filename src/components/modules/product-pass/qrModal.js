import { useState } from 'react'
import React from 'react'
import api from '@/lib/common/api'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import { TicketIcon, QrCodeIcon } from '@heroicons/react/24/outline';

function QRModal({ url }) {

    const [qrCode, setQrCode] = useState(null)
    const [submitQR, setSubmitQR] = useState(false)
    const [showModal, setShowModal] = useState(false)


    const toggleModal = () => {
        setShowModal(!showModal)
    }

    const createQR = async () => {
        setSubmitQR(true)
        setShowModal(true)
        const res = await api(`https://api.vagabonds.cloud/qrpass`, {
            method: 'POST',
            body: {
                data: url
            }
        })
        setSubmitQR(false)
        setQrCode(res.data)
    }

    return (
        <div>
            <Button className="bg-red-600 text-white hover:bg-red-500" onClick={() => createQR()}><QrCodeIcon className="text-white w-6 h-6" /></Button>
            <Modal show={showModal} title="Product Pass" toggle={toggleModal}>
                <div className="mt-10">
                    <img src={qrCode} className="w-80 h-80" alt="" />
                </div>
            </Modal>
        </div>
    )
}

export default QRModal