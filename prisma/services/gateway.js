import prisma from '@/prisma/index';


export const createSession = async (blob) => {
    const session = await prisma.vagaSession.create({
        data: {
            session: blob.session_id,
            type: blob.type,
            account: blob.account,
            to: blob.to,
            amount: blob.amount,
            flag: blob.flag,
            node: blob.node,
            memo: blob.memo,
            expiresAt: blob.expiresAt,
            gatewayURL: blob.gatewayURL,
        },
    });
    return session
};

export const getSession = async (session) =>
    await prisma.vagaSession.findUnique({
        where: {
            session,
        },
    });

export const updateSession = async (session, expired) =>
    await prisma.vagaSession.update({
        data: {
            expired
        },
        where: { session },
    });