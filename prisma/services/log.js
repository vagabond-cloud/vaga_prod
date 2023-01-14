import { InvitationStatus, TeamRole } from '@prisma/client';
import prisma from '@/prisma/index';

export const captureLog = async (title, description, action, ip, userId) => {

    const logs = await prisma.log.createMany({
        data: {
            title,
            description,
            action,
            ip,
            userId
        },
    });
    console.log(logs)
    return logs
}

export const captureContactActivities = async (title, description, action, ip, userId, contactId) => {

    const activity = await prisma.contactActivity.createMany({
        data: {
            title,
            description,
            action,
            ip,
            userId,
            contactId
        },
    });

    return activity
}