import { InvitationStatus, TeamRole } from '@prisma/client';
import prisma from '@/prisma/index';

export const createModule = async (addedById, email, name, network, workspaceId, type) => {

    const modules = await prisma.module.createMany({
        data: {
            addedById,
            email,
            name,
            network,
            type,
            workspaceId,
        },
    });
    return modules
}

export const getModule = async (moduleCode) =>
    await prisma.module.findUnique({
        where: {
            moduleCode
        },
        include: {
            workspace: true,
        },
    });

export const getModules = async (id) =>
    await prisma.module.findMany({
        where: { addedById: id },
        include: {
            workspace: true,
        },
    });

export const createContact = async (contactOwnerId, email, data, workspaceId, moduleid) => {

    const contacts = await prisma.contact.createMany({
        data: {
            contactOwnerId,
            email,
            firstName: data.firstName,
            lastName: data.lastName,
            contactEmail: data.contactEmail,
            jobTitle: data.jobTitle,
            phone: data.phone,
            lifecycleStage: data.lifecycleStage,
            leadStatus: data.leadStatus,
            marketing: data.marketing,
            city: data.city,
            state: data.state,
            country: data.country,
            street: data.street,
            zip: data.zip,
            website: data.website,
            persona: data.persona,
            timeZone: data.timeZone,
            twitter_handle: data.twitter_handle,
            preferred_language: data.preferred_language,
            companyId: data.companyId,
            photoUrl: data.photoUrl,
            bannerUrl: data.bannerUrl,
            workspaceId,
            moduleid
        },
    });
    return contacts
}

export const updateContact = async (id, contactOwnerId, email, data, workspaceId, moduleid) => {
    const contact = await prisma.contact.findUnique({
        where: {
            id
        },
    });
    const contacts = await prisma.contact.update({
        where: { id },
        data: {
            contactOwnerId: !contactOwnerId ? contact.contactOwnerId : contactOwnerId,
            email: !email ? contact.email : email,
            firstName: !data.firstName ? contact.firstName : data.firstName,
            lastName: !data.lastName ? contact.lastName : data.lastName,
            contactEmail: !data.contactEmail ? contact.contactEmail : data.contactEmail,
            jobTitle: !data.jobTitle ? contact.jobTitle : data.jobTitle,
            phone: !data.phone ? contact.phone : data.phone,
            lifecycleStage: !data.lifecycleStage ? contact.lifecycleStage : data.lifecycleStage,
            leadStatus: !data.leadStatus ? contact.leadStatus : data.leadStatus,
            marketing: !data.marketing ? contact.marketing : data.marketing,
            city: !data.city ? contact.city : data.city,
            state: !data.state ? contact.state : data.state,
            country: !data.country ? contact.country : data.country,
            street: !data.street ? contact.street : data.street,
            zip: !data.zip ? contact.zip : data.zip,
            website: !data.website ? contact.website : data.website,
            persona: !data.persona ? contact.persona : data.persona,
            timeZone: !data.timeZone ? contact.timeZone : data.timeZone,
            twitter_handle: !data.twitter_handle ? contact.twitter_handle : data.twitter_handle,
            preferred_language: !data.preferred_language ? contact.preferred_language : data.preferred_language,
            workspaceId: !data.workspaceId ? contact.workspaceId : data.workspaceId,
            moduleid: !data.moduleid ? contact.moduleid : data.moduleid,
            companyId: !data.companyId ? contact.companyId : data.companyId,
            photoUrl: !data.photoUrl ? contact.photoUrl : data.photoUrl,
            bannerUrl: !data.bannerUrl ? contact.bannerUrl : data.bannerUrl,
        },
    });
    return contacts
}

export const getContact = async (id) =>
    await prisma.contact.findUnique({
        where: {
            id
        },
        include: {
            user: true
        }
    });


export const getContacts = async (moduleid) =>
    await prisma.contact.findMany({
        where: { moduleid },
        include: {
            module: true,
            user: true
        },
    });


export const createNote = async (addedById, email, contactId, note, title) => {

    const modules = await prisma.note.createMany({
        data: {
            addedById,
            email,
            contactId,
            note,
            title
        },
    });
    return modules
}

export const getNote = async (contactId) =>
    await prisma.note.findMany({
        where: { contactId },
        include: {
            contact: true,
        },
        include: {
            user: true
        }
    });

export const deleteNote = async (id) => {
    const note = await prisma.note.delete({
        where: { id },
    });
    return note
}

export const createCall = async (addedById, email, contactId, note, outcome, direction, date, time) => {

    const modules = await prisma.call.createMany({
        data: {
            addedById,
            email,
            contactId,
            outcome,
            direction,
            date,
            time,
            note,
        },
    });
    return modules
}

export const getCall = async (contactId) =>
    await prisma.call.findMany({
        where: { contactId },
        include: {
            contact: true,
        },
        include: {
            user: true
        }
    });

export const deleteCall = async (id) => {
    const note = await prisma.call.delete({
        where: { id },
    });
    return note
}


export const createTask = async (addedById, email, contactId, note, title, reminder, type, priority, queue, assigned, date) => {

    const modules = await prisma.task.createMany({
        data: {
            addedById,
            email,
            contactId,
            note,
            title,
            reminder,
            type,
            priority,
            queue,
            assigned,
            date
        },
    });
    return modules
}

export const getTask = async (contactId) =>
    await prisma.task.findMany({
        where: { contactId },
        include: {
            contact: true,
        },
        include: {
            user: true
        }
    });

export const deleteTask = async (id) => {
    const note = await prisma.task.delete({
        where: { id },
    });
    return note
}

export const getActivity = async (id, page) => {
    console.log(page)
    const allActivities = await prisma.contactActivity.findMany({
        where: { contactId: id },
    });

    const activities = await prisma.contactActivity.findMany({
        skip: page > 0 ? parseFloat(page) * 10 : 0,
        take: 10,
        orderBy: {
            id: "desc",
        },
        where: { contactId: id },
    });
    return { activities, allActivities }
}

export const createCompany = async (companyOwnerId, email, data, workspaceId, moduleid) => {

    const contacts = await prisma.company.createMany({
        data: {
            companyOwnerId,
            email,
            companyDomain: data.companyDomain,
            companyName: data.companyName,
            industry: data.industry,
            type: data.type,
            phone: data.phone,
            city: data.city,
            street: data.street,
            state: data.state,
            zip: data.zip,
            country: data.country,
            employees: data.employees,
            revenue: data.revenue,
            timeZone: data.timeZone,
            description: data.description,
            linkedin: data.linkedin,
            website: data.website,
            logoUrl: data.logoUrl,
            bannerUrl: data.bannerUrl,
            workspaceId,
            moduleid
        },
    });
    return contacts
}

export const updateCompany = async (id, companyOwnerId, email, data, workspaceId, moduleid) => {

    const company = await prisma.company.findUnique({
        where: {
            id
        },
    });
    const companies = await prisma.company.update({
        where: { id },
        data: {
            companyOwnerId: !companyOwnerId ? company.companyOwnerId : companyOwnerId,
            email: !email ? company.email : email,
            companyDomain: !data.companyDomain ? company.companyDomain : data.companyDomain,
            companyName: !data.companyName ? company.companyName : data.companyName,
            industry: !data.industry ? company.industry : data.industry,
            type: !data.type ? company.type : data.type,
            phone: !data.phone ? company.phone : data.phone,
            street: !data.street ? company.street : data.street,
            city: !data.city ? company.city : data.city,
            state: !data.state ? company.state : data.state,
            zip: !data.zip ? company.zip : data.zip,
            country: !data.country ? company.country : data.country,
            employees: !data.employees ? company.employees : data.employees,
            revenue: !data.revenue ? company.revenue : data.revenue,
            timeZone: !data.timeZone ? company.timeZone : data.timeZone,
            description: !data.description ? company.description : data.description,
            linkedin: !data.linkedin ? company.linkedin : data.linkedin,
            website: !data.website ? company.website : data.website,
            workspaceId: !workspaceId ? company.workspaceId : workspaceId,
            moduleid: !moduleid ? company.moduleid : moduleid,
            logoUrl: !data.logoUrl ? company.logoUrl : data.logoUrl,
            bannerUrl: !data.bannerUrl ? company.bannerUrl : data.bannerUrl,
        },
    });
    return companies
}

export const getCompany = async (id) =>
    await prisma.company.findUnique({
        where: {
            id
        },
        include: {
            user: true,
            contacts: true
        }
    });


export const getCompanies = async (moduleid) =>
    await prisma.company.findMany({
        include: {
            module: true,
            user: true,
            contacts: true
        },
    });


export const getDocuments = async (id) =>
    await prisma.document.findMany({
        where: { companyId: id },

    });


export const createDeal = async (addedById, email, data, workspaceId, moduleid) => {

    const contacts = await prisma.deal.createMany({
        data: {
            addedById,
            email,
            dealName: data.dealName,
            pipeline: data.pipeline,
            dealStage: data.dealStage,
            amount: data.amount,
            closeDate: data.closeDate,
            dealOwnerId: data.dealOwnerId,
            dealType: data.dealType,
            priority: data.priority,
            contactId: data.contactId,
            companyId: data.companyId,
            workspaceId,
            moduleid
        },
    });
    return contacts
}


export const getDeal = async (id) =>
    await prisma.deal.findUnique({
        where: {
            id
        },
        include: {
            user: true,
            contact: true,
            company: true
        }
    });


export const getDeals = async (moduleid) =>
    await prisma.deal.findMany({
        include: {
            module: true,
            user: true,
            contact: true,
            company: true
        },
    });