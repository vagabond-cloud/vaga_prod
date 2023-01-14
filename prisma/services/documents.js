import { InvitationStatus, TeamRole } from '@prisma/client';
import prisma from '@/prisma/index';

export const captureDocument = async (title, documentUrl, companyId, contactId, addedById, email) => {

    const documents = await prisma.document.createMany({
        data: {
            title,
            documentUrl,
            companyId,
            contactId,
            addedById,
            email
        },
    });

    return documents
}