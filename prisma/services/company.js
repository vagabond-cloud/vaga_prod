import prisma from '@/prisma/index';

export const createCompany = async (uid, email, data) => {
    console.log(data)
    const company = await prisma.registered_company.createMany({
        data: {
            companyid: data.companyid,
            applicationid: data.applicationid,
            company_name: data.company_name,
            company_reg_number: data.company_reg_number,
            contact_name: data.contact_name,
            contact_email: data.contact_email,
            contact_phone: data.contact_phone,
            account_type: data.account_type,
            registration_country: data.registration_country,
            registration_city: data.registration_city,
            date_registered: data.date_registered,
            status: data.status,
            workspace: data.workspace,
            workspaceid: data.workspaceid,
            reg_doc: data.reg_doc,
            addedbyid: uid,
            addedbyemail: email,
        }
    });
    return company
}

export const getCompanies = async (workspaceid) => {
    const companies = await prisma.registered_company.findMany({
        where: { workspaceid }
    });
    return companies
}