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
            Crmsettings: true,
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
            jobTitle: data.jobTitle || null,
            phone: data.phone || null,
            lifecycleStage: data.lifecycleStage || null,
            leadStatus: data.leadStatus || null,
            marketing: data.marketing || null,
            city: data.city || null,
            state: data.state || null,
            country: data.country || null,
            street: data.street || null,
            zip: data.zip || null,
            website: data.website || null,
            persona: data.persona || null,
            timeZone: data.timeZone || null,
            twitter_handle: data.twitter_handle || null,
            preferred_language: data.preferred_language || null,
            companyId: data.companyId || null,
            photoUrl: data.photoUrl || null,
            bannerUrl: data.bannerUrl || null,
            salutation: data.salutation || null,
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
            contactOwnerId: data.contactOwnerId || undefined,
            email: data.email || undefined,
            firstName: data.firstName || undefined,
            lastName: data.lastName || undefined,
            contactEmail: data.contactEmail || undefined,
            jobTitle: data.jobTitle || undefined,
            phone: data.phone || undefined,
            lifecycleStage: data.lifecycleStage || undefined,
            leadStatus: data.leadStatus || undefined,
            marketing: data.marketing || undefined,
            city: data.city || undefined,
            state: data.state || undefined,
            country: data.country || undefined,
            street: data.street || undefined,
            zip: data.zip || undefined,
            website: data.website || undefined,
            persona: data.persona || undefined,
            timeZone: data.timeZone || undefined,
            twitter_handle: data.twitter_handle || undefined,
            preferred_language: data.preferred_language || undefined,
            workspaceId: data.workspaceId || undefined,
            moduleid: data.moduleid || undefined,
            companyId: data.companyId || undefined,
            photoUrl: data.photoUrl || undefined,
            bannerUrl: data.bannerUrl || undefined,
            salutation: data.salutation || undefined,
        },
    });
    return contacts
}

export const updatePhoto = async (id, photoUrl) => {

    const userPhoto = await prisma.contact.update({
        where: { id },
        data: {
            photoUrl: photoUrl || undefined,
        },
    });
    return userPhoto
}

export const updateContactsBanner = async (id, bannerUrl) => {

    const userBanner = await prisma.contact.update({
        where: { id },
        data: {
            bannerUrl: bannerUrl || undefined,
        },
    });
    return userBanner
}

export const getContact = async (id) =>
    await prisma.contact.findUnique({
        where: {
            id
        },
        include: {
            user: true,
            note: true,
            call: true,
            task: true,
            document: true,
            deal: true,
            ticket: {
                include: {
                    user: true,
                    deal: true,
                }
            },
            deal: true
        }
    });

export const getDealContacts = async (moduleid) =>
    await prisma.contact.findMany({
        where: { moduleid },
        include: {
            module: true,
            user: true
        },
    });

export const getContacts = async (page, limit, sort, moduleid) => {
    const contacts = await prisma.contact.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            contactEmail: true,
            jobTitle: true,
            phone: true,
            lifecycleStage: true,
            leadStatus: true,
            marketing: true,
            city: true,
            state: true,
            country: true,
            street: true,
            zip: true,
            website: true,
            persona: true,
            timeZone: true,
            twitter_handle: true,
            preferred_language: true,
            workspaceId: true,
            moduleid: true,
            companyId: true,
            photoUrl: true,
            bannerUrl: true,
            contactOwnerId: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            user: true,
            module: true,
        },
        where: { moduleid },
    });

    return contacts;
};

export const getAllContacts = async (page, limit, sort, moduleid) => {
    const skip = (page - 1) * limit;
    const contacts = await prisma.contact.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            contactEmail: true,
            jobTitle: true,
            phone: true,
            lifecycleStage: true,
            leadStatus: true,
            marketing: true,
            city: true,
            state: true,
            country: true,
            street: true,
            zip: true,
            website: true,
            persona: true,
            timeZone: true,
            twitter_handle: true,
            preferred_language: true,
            workspaceId: true,
            moduleid: true,
            companyId: true,
            photoUrl: true,
            bannerUrl: true,
            contactOwnerId: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            user: true,
            module: true,
        },
        where: { moduleid },
        skip,
        take: limit,
        orderBy: sort,
    });
    const total = await prisma.contact.count();
    return { contacts, total };
};


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
            companyOwnerId: companyOwnerId,
            email: email,
            companyDomain: data.companyDomain || undefined,
            companyName: data.companyName || undefined,
            industry: data.industry || undefined,
            type: data.type || undefined,
            phone: data.phone || undefined,
            street: data.street || undefined,
            city: data.city || undefined,
            state: data.state || undefined,
            zip: data.zip || undefined,
            country: data.country || undefined,
            employees: data.employees || undefined,
            revenue: data.revenue || undefined,
            timeZone: data.timeZone || undefined,
            description: data.description || undefined,
            linkedin: data.linkedin || undefined,
            website: data.website || undefined,
            workspaceId: workspaceId,
            moduleid: moduleid,
            logoUrl: data.logoUrl || undefined,
            bannerUrl: data.bannerUrl || undefined,
        },
    });
    return companies
}

export const updateLogo = async (id, logoUrl) => {

    const companies = await prisma.company.update({
        where: { id },
        data: {
            logoUrl: logoUrl || undefined,
        },
    });
    return companies
}

export const updateBanner = async (id, bannerUrl) => {

    const companies = await prisma.company.update({
        where: { id },
        data: {
            bannerUrl: bannerUrl || undefined,
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
            contacts: true,
            deal: true,
            call: true,
            task: true,
            note: true,
            document: true,
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

export const getAllCompanies = async (page, limit, sort, moduleid) => {
    const skip = (page - 1) * limit;
    const companies = await prisma.company.findMany({
        select: {
            id: true,
            companyName: true,
            companyDomain: true,
            industry: true,
            type: true,
            phone: true,
            city: true,
            street: true,
            state: true,
            zip: true,
            country: true,
            employees: true,
            revenue: true,
            timeZone: true,
            description: true,
            linkedin: true,
            website: true,
            logoUrl: true,
            bannerUrl: true,
            module: true,
            user: true,
            contacts: true

        },
        where: { moduleid },
        skip,
        take: limit,
        orderBy: sort,
    });
    const total = await prisma.company.count();
    return { companies, total };
};





export const getDocuments = async (id) =>
    await prisma.document.findMany({
        where: { companyId: id },

    });

// search for documents by title and type
export const searchDocuments = async (id, title, type) =>
    await prisma.document.findMany({
        where: {
            OR: [
                { title: { contains: title } },
                { type: { contains: type } }
            ],
            AND: {
                companyId: id
            },
        },
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
            dealOwnerId: addedById,
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
            company: true,
            module: true,
        }
    });


export const getDeals = async (moduleid) =>
    await prisma.deal.findMany({
        where: { moduleid },
        include: {
            module: true,
            user: true,
            contact: true,
            company: true
        },
    });

export const getAllDeals = async (page, limit, sort, moduleid) => {
    const skip = (page - 1) * limit;
    const deals = await prisma.deal.findMany({
        select: {
            id: true,
            dealName: true,
            pipeline: true,
            dealStage: true,
            amount: true,
            closeDate: true,
            dealOwnerId: true,
            dealType: true,
            priority: true,
            contactId: true,
            companyId: true,
            module: true,
            user: true,
            contact: true,
            company: true
        },
        where: { dealStage, moduleid },
        skip,
        take: limit,
        orderBy: sort,
    });
    const total = await prisma.deal.count();
    return { deals, total };
};

// get Deal by dealStage

export const getDealByStage = async (page, limit, sort, dealStage, moduleid) => {
    const skip = (page - 1) * limit;
    const deals = await prisma.deal.findMany({
        select: {
            id: true,
            dealName: true,
            pipeline: true,
            dealStage: true,
            amount: true,
            closeDate: true,
            dealOwnerId: true,
            dealType: true,
            priority: true,
            contactId: true,
            companyId: true,
            module: true,
            user: true,
            contact: true,
            company: true,
            module: true
        },
        where: { dealStage, moduleid },

        skip,
        take: limit,
        orderBy: sort,
    });
    const total = await prisma.deal.count({
        where: { dealStage, moduleid },

    });
    return { deals, total };
}

// assign deal to user

export const assignDeal = async (id, aassignedTo) => {
    const deal = await prisma.deal.update({
        where: { id },
        data: {
            aassignedTo
        },
    });
    return deal
}

export const createCRMSettings = async (workspaceId, moduleid, data) => {
    console.log(workspaceId)
    const deal = await prisma.crmsettings.createMany({
        data: {
            companyName: data.companyName,
            timeZone: data.timeZone,
            currency: data.currency,
            language: data.language,
            workspaceId,
            moduleid
        },
    });
    return deal
}

export const getCRMSettings = async (moduleid) =>
    await prisma.crmsettings.findMany({
        where: { moduleid },
    });

export const updateCRMSettings = async (workspaceId, moduleid, data, id) => {
    const settings = await prisma.crmsettings.update({
        where: { id },
        data: {
            companyName: data.companyName || undefined,
            timeZone: data.timeZone || undefined,
            currency: data.currency || undefined,
            language: data.language || undefined,
            country: data.country || undefined,
        },
    });
    return settings
}

export const createTicket = async (addedById, email, data) => {
    console.log(data)
    const ticket = await prisma.ticket.createMany({
        data: {
            addedById,
            email,
            ticketName: data.ticketName,
            ticketDescription: data.ticketDescription,
            pipeline: data.pipeline,
            ticketStatus: data.ticketStatus,
            source: data.source,
            ticketOwner: data.ticketOwner,
            priority: data.priority,
            createDate: data.createDate,
            associatedContact: data.associatedContact || undefined,
            associatedCompany: data.associatedCompany || undefined,
            associatedDeal: data.associatedDeal,
        },
    });
    return ticket
}

export const updateTicket = async (addedById, email, data) => {

    const ticket = await prisma.ticket.update({
        data: {
            addedById,
            email,
            ticketName: data.ticketName || undefined,
            ticketDescription: data.ticketDescription || undefined,
            pipeline: data.pipeline || undefined,
            ticketStatus: data.ticketStatus || undefined,
            source: data.source || undefined,
            ticketOwner: data.ticketOwner || undefined,
            priority: data.priority || undefined,
            createDate: data.createDate || undefined,
            associatedContact: data.associatedContact || undefined,
            associatedCompany: data.associatedCompany || undefined,
            associatedDeal: data.associatedDeal || undefined,

        },
    });
    return ticket
}


export const getTicket = async (associatedDeal) =>
    await prisma.ticket.findMany({
        where: { associatedDeal },
        include: {
            deal: true,
            contact: true,
            company: true,
            user: true
        },
    });

export const deleteTicket = async (id) => {
    const ticket = await prisma.ticket.delete({
        where: { id },
    });
    return ticket
}