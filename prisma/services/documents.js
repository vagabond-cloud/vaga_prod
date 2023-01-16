import { InvitationStatus, TeamRole } from '@prisma/client';
import prisma from '@/prisma/index';

export const captureDocument = async (data, addedById, email) => {

    const documents = await prisma.document.createMany({
        data: {
            title: data.title,
            documentUrl: data.documentUrl,
            companyId: data.companyId,
            contactId: data.contactId,
            size: data.fileSize,
            type: data.type,
            lastModified: data.lastModified,
            addedById,
            email
        },
    });

    return documents
}