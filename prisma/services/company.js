import prisma from '@/prisma/index';

export const createCompany = async (data) => {
    const company = await prisma.registeredCompany.create({

        data
    });
}

export const getCompanies = async () => {
    const companies = await prisma.registeredCompany.findMany({
        where: { workspaceid: data.workspaceid }
    });
    return companies
}