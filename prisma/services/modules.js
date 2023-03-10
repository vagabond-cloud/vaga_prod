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

export const getModules = async (id, workspaceId) =>
    await prisma.module.findMany({

        where: {
            addedById: id,
            workspaceId: workspaceId
        },
        include: {
            workspace: true,
        },
    });

export const updateModule = async (id, data) =>
    await prisma.module.update({
        where: { id },
        data
    })


export const getModulesByWorkspace = async (id) =>
    await prisma.module.findMany({

        where: { workspaceId: id, active: true },
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
            deal: {
                include: {
                    Project: true,
                }
            }
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
            call: true,
            task: true,
            note: true,
            document: true,
            deal: {
                include: {
                    Project: true,
                }
            }
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

export const getAllDocuments = async (page, limit, sort, id) => {
    const skip = (page - 1) * limit;

    const document = await prisma.document.findMany({
        where: {
            OR: [
                { addedById: id },
                { companyId: id },
                { contactId: id },
            ],
        },
        skip,
        take: limit,
        orderBy: sort,
    });
    const total = await prisma.document.count();
    return { document, total }
}


// search for documents by title and type
export const searchDocuments = async (id, title, type) =>
    await prisma.document.findMany({
        where: {
            OR: [
                { title: { contains: title } },
                { type: { contains: type } }
            ],
            AND: {
                OR: [
                    { companyId: id },
                    { contactId: id },
                    { dealId: id },
                ],
            },
        },
    });

export const searchAllDocuments = async (title, type) =>
    await prisma.document.findMany({
        where: {
            OR: [
                { title: { contains: title } },
                { type: { contains: type } }
            ],
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
            Project: true,
        }
    });


export const getDeals = async (moduleid) =>
    await prisma.deal.findMany({
        where: { moduleid },
        include: {
            module: true,
            user: true,
            contact: true,
            company: true,
            Project: true
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
            company: true,
            Project: true,
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
            module: true,
            Project: true,

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

    const deal = await prisma.crmsettings.createMany({
        data: {
            companyName: data.companyName,
            timeZone: data.timeZone,
            currency: data.currency,
            language: data.language,
            vat: data.vat,
            description: data.description,
            email: data.email,
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip,
            country: data.country,
            bank: data.bank,
            iban: data.iban,
            bic: data.bic,
            logo: data.logo,
            active: data.active,
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
            vat: data.vat || undefined,
            description: data.description || undefined,
            email: data.email || undefined,
            street: data.street || undefined,
            city: data.city || undefined,
            state: data.state || undefined,
            zip: data.zip || undefined,
            bank: data.bank || undefined,
            iban: data.iban || undefined,
            bic: data.bic || undefined,
            logo: data.logo || undefined,
            active: data.active || undefined,
        },
    });
    return settings
}

export const createTicket = async (addedById, email, data) => {

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


export const getOwnersTickets = async (addedById) =>
    await prisma.ticket.findMany({
        where: {
            OR: [
                { addedById },
                { assignedTo: addedById }, // Added ticketOwner here 
            ],
        },
        include: {
            deal: {
                select: { // Added select
                    contact: true,
                    company: true,
                }
            },
            user: true,
        },
    });

export const deleteTicket = async (id) => {
    const ticket = await prisma.ticket.delete({
        where: { id },
    });
    return ticket
}


// create a quote for a deal 
export const createQuote = async (addedById, email, data) => {

    const quote = await prisma.quote.createMany({
        data: {
            addedById,
            email,
            clientName: data.clientName,
            quoteNumber: data.quoteNumber,
            dealId: data.dealId,
            quoteDate: data.quoteDate,
            quoteStatus: data.quoteStatus,
            street: data.street,
            clientId: data.clientId,
            zip: data.zip,
            city: data.city,
            country: data.country,
            validUntil: data.validUntil,
            subject: data.subject,
            intro: data.intro,
            item: data.item,
            footer: data.footer,
            note: data.note,
            moduleid: data.moduleid,
        },
    });
    return quote
}


// update a quote for a deal
export const updateQuote = async (id, addedById, email, data) => {
    const quote = await prisma.quote.update({
        where: { id },
        data: {
            addedById,
            email,
            clientName: data.clientName || undefined,
            quoteNumber: data.quoteNumber || undefined,
            dealId: data.dealId || undefined,
            quoteDate: data.quoteDate || undefined,
            quoteStatus: data.quoteStatus || undefined,
            street: data.street || undefined,
            clientId: data.clientId || undefined,
            zip: data.zip || undefined,
            city: data.city || undefined,
            country: data.country || undefined,
            validUntil: data.validUntil || undefined,
            subject: data.subject || undefined,
            intro: data.intro || undefined,
            item: data.item || undefined,
            footer: data.footer || undefined,
            note: data.note || undefined,
            moduleid: data.moduleid,

        },
    });
    return quote
}

// get quote by deal
export const getQuote = async (id, dealId) => {
    const quotes = await prisma.quote.findMany({
        where: { id, dealId },
    });
    return quotes
}

export const getQuotes = async (dealId) => {
    const quotes = await prisma.quote.findMany({
        where: { dealId },
    });
    return quotes
}

export const getAllQuotes = async (moduleid) => {
    const quotes = await prisma.quote.findMany({
        where: { moduleid },
    });
    return quotes
}


// delete quote by deal
export const deleteQuote = async (id) => {
    const quote = await prisma.quote.delete({
        where: { id },
    });
    return quote
}

// create a quote for a deal 
export const createInvoice = async (addedById, email, data) => {

    const invoice = await prisma.invoice.createMany({
        data: {
            addedById,
            email,
            clientName: data.clientName,
            invoiceNumber: data.invoiceNumber,
            dealId: data.dealId,
            invoiceDate: data.invoiceDate,
            invoiceStatus: data.invoiceStatus,
            street: data.street,
            clientId: data.clientId,
            zip: data.zip,
            city: data.city,
            country: data.country,
            validUntil: data.validUntil,
            subject: data.subject,
            intro: data.intro,
            item: data.item,
            footer: data.footer,
            note: data.note,
            moduleid: data.moduleid,

        },
    });
    return invoice
}


// update a invoice for a deal
export const updateInvoice = async (id, addedById, email, data) => {
    const invoice = await prisma.invoice.update({
        where: { id },
        data: {
            addedById,
            email,
            clientName: data.clientName || undefined,
            invoiceNumber: data.invoiceNumber || undefined,
            dealId: data.dealId || undefined,
            invoiceDate: data.invoiceDate || undefined,
            invoiceStatus: data.invoiceStatus || undefined,
            street: data.street || undefined,
            clientId: data.clientId || undefined,
            zip: data.zip || undefined,
            city: data.city || undefined,
            country: data.country || undefined,
            validUntil: data.validUntil || undefined,
            subject: data.subject || undefined,
            intro: data.intro || undefined,
            item: data.item || undefined,
            footer: data.footer || undefined,
            note: data.note || undefined,
            moduleid: data.moduleid,

        },
    });
    return invoice
}

// get invoice by deal
export const getInvoice = async (id, dealId) => {
    const invoices = await prisma.invoice.findMany({
        where: { id, dealId },
    });
    return invoices
}

export const getInvoices = async (dealId) => {
    const invoices = await prisma.invoice.findMany({
        where: { dealId },
    });
    return invoices
}


export const getAllInvoices = async (moduleid) => {
    const invoices = await prisma.invoice.findMany({
        where: { moduleid },
    });
    return invoices
}



// delete invoice by deal
export const deleteInvoice = async (id) => {
    const invoice = await prisma.invoice.delete({
        where: { id },
    });
    return invoice
}

export const getProjectData = async (id) => {
    const data = await prisma.project.findMany({
        where: { id },
        include: {
            ProjectItemDocuments: true,
            ProjectItem: true,
            deal: {
                include: {
                    contact: true,
                    company: true,
                    ticket: true,
                }
            },
        }
    })

    if (data.length === 0) {
        var boardData = [{ data: "createBoard" }];
    } else {
        var boardData = JSON.parse(JSON.stringify(data));
    }

    return boardData[0]
}

export const getAllProjects = async (moduleId) => {
    const data = await prisma.project.findMany({
        where: { moduleId },
        include: {
            deal: true,
        }
    })


    var boardData = JSON.parse(JSON.stringify(data));

    return boardData
}


// create a quote for a deal 
export const createProject = async (addedById, email, data) => {

    const project = await prisma.project.createMany({
        data: {
            addedById,
            email,
            projectName: data.projectName,
            projectType: data.projectType,
            projectStatus: data.projectStatus,
            projectOwner: data.projectOwner,
            priority: data.priority,
            resolution: data.resolution,
            assignedTo: data.assignedTo,
            dealId: data.dealId,
            moduleId: data.moduleId,
            imageUrl: data.imageUrl,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
        },
    });
    return project
}

export const createProjectItem = async (addedById, email, data) => {

    const project = await prisma.projectItem.createMany({
        data: {
            addedById,
            email,
            assignees: data.assignees || undefined,
            attachment: data.attachment || undefined,
            boardId: data.boardId,
            boardIndex: data.boardIndex,
            chat: data.chat || undefined,
            priority: data.priority || undefined,
            title: data.title || undefined,
            itemStatus: data.itemStatus || undefined,
            itemOwner: data.itemOwner || undefined,
            projectId: data.projectId || undefined,
        },
    });
    return project
}

export const updateProjectItem = async (addedById, email, data) => {

    const project = await prisma.projectItem.update({
        where: { id },
        data: {
            addedById,
            email,
            assignees: data.assignees || undefined,
            attachment: data.attachment || undefined,
            boardId: data.boardId || undefined,
            boardIndex: data.boardIndex || undefined,
            chat: data.chat || undefined,
            priority: data.priority || undefined,
            title: data.title || undefined,
            itemStatus: data.itemStatus || undefined,
            itemOwner: data.itemOwner || undefined,
            projectId: data.projectId || undefined,
        },
    });
    return project
}

export const updateProjectBoardPosition = async (id, addedById, email, data) => {

    const project = await prisma.projectItem.update({
        where: { id },
        data: {
            addedById,
            email,
            assignees: data.assignees || undefined,
            attachment: data.attachment || undefined,
            boardId: data.boardId || undefined,
            boardIndex: data.boardIndex,
            chat: data.chat || undefined,
            priority: data.priority || undefined,
            title: data.title || undefined,
            itemStatus: data.itemStatus || undefined,
            itemOwner: data.itemOwner || undefined,
            projectId: data.projectId || undefined,
        },
    });

    return project
}

export const getProjectItems = async (id) => {
    const data = await prisma.projectItem.findMany({
        where: { projectId: id },
        include: {
            project: true,
            comments: true,
            documents: true,
        }
    })

    if (data.length === 0) {
        var boardData = [{ data: "createBoard" }];
    } else {
        var boardData = JSON.parse(JSON.stringify(data));
    }

    return boardData
}

export const createMaterial = async (addedbyid, addedbyemail, workspaceid, moduleid, data) => {

    const material = await prisma.pp_materials.createMany({
        data: {
            workspaceid,
            moduleid,
            vid: data.vid,
            version: data.version,
            material: data.material,
            material_name: data.material_name,
            material_description: data.material_description,
            material_type: data.material_type,
            unit: data.unit,
            material_nr: data.material_nr,
            division: data.division,
            product_allocation: data.product_allocation,
            material_status: data.material_status,
            material_group: data.material_group,
            office: data.office,
            valid_from: data.valid_from,
            item_group: data.item_group,
            auth_group: data.auth_group,
            gross_weight: data.gross_weight,
            net_weight: data.net_weight,
            unit_weight: data.unit_weight,
            volume: data.volume,
            size: data.size,
            ean: data.ean,
            packaging_material: data.packaging_material,
            addedbyid,
            addedbyemail,
        }
    })
    return material
}

export const updateMaterial = async (id, data) =>
    await prisma.pp_materials.update({
        where: { id },
        data
    })

export const getMaterials = async (page, limit, sort, moduleid) => {
    const skip = (page - 1) * limit;
    const materials = await prisma.pp_materials.findMany({

        where: { moduleid },
        skip,
        take: limit,
        orderBy: sort,
    });
    const total = await prisma.pp_materials.count();
    return { materials, total };
};


export const getMaterial = async (id) => {
    const material = await prisma.pp_materials.findUnique({

        where: { id },
    });

    return material;
};


export const createLocation = async (addedbyid, addedbyemail, workspaceid, moduleid, data) => {

    const location = await prisma.pp_locations.createMany({
        data: {
            workspaceid,
            moduleid,
            vid: data.vid,
            location_name: data.location_name,
            street: data.street,
            postal: data.postal,
            city: data.city,
            country: data.country,
            po_box: data.po_box,
            po_code: data.po_code,
            language: data.language,
            phone: data.phone,
            fax: data.fax,
            email: data.email,
            standard_comm_method: data.standard_comm_method,
            is_plant: data.is_plant,
            plant_id: data.plant_id,
            plant_name: data.plant_name,
            fork_lift: data.fork_lift,
            lift_gate: data.lift_gate,
            loading_dock: data.loading_dock,
            photo_allowed: data.photo_allowed,
            floor_protection: data.floor_protection,
            insurance: data.insurance,
            union_labor: data.union_labor,
            height_limit: data.height_limit,
            security_clearance: data.security_clearance,
            docking_from: data.docking_from,
            docking_to: data.docking_to,
            max_truck_size: data.max_truck_size,
            addedbyid,
            addedbyemail,
        }
    })
    return location
}

export const updateLocation = async (id, data) =>
    await prisma.pp_locations.update({
        where: { id },
        data
    })

export const getLocations = async (page, limit, sort, moduleid) => {
    const skip = (page - 1) * limit;
    const materials = await prisma.pp_locations.findMany({
        where: { moduleid },
        skip,
        take: limit,
        orderBy: sort,
    });
    const total = await prisma.pp_locations.count();
    return { materials, total };
};


export const getLocation = async (id) => {
    const material = await prisma.pp_locations.findUnique({
        where: { id },
    });
    return material;
};

export const getLocationsByModule = async (moduleid) => {
    const material = await prisma.pp_locations.findMany({
        where: { moduleid },
    });
    return material;
};


export const createProductPass = async (addedbyid, addedbyemail, workspaceid, moduleid, data) => {

    const pass = await prisma.pp_productPass.createMany({
        data: {
            workspaceid,
            moduleid,
            vid: data.vid,
            version: data.version,
            identification: data.identification,
            identification_value: data.identification_value,
            product_name: data.product_name,
            parent_organization: data.parent_organization,
            brand: data.brand,
            product_description: data.product_description,
            intended_sale: data.intended_sale,
            season: data.season,
            retail_price: data.retail_price,
            companyid: data.companyid,
            currency_code: data.currency_code,
            size: data.size,
            product_color: data.product_color,
            age_group: data.age_group,
            gender: data.gender,
            categorization_standard: data.categorization_standard,
            product_family: data.product_family,
            product_category: data.product_category,
            country_origin: data.country_origin,
            manufacturing_facility: data.manufacturing_facility,
            manufacturing_name: data.manufacturing_name,
            material_traceability_provider: data.material_traceability_provider,
            material_type: data.material_type,
            finishes: data.finishes,
            material_certifications: data.material_certifications,
            net_weight: data.net_weight,
            id_type: data.id_type,
            id_material: data.id_material,
            id_location: data.id_location,
            material_composition: data.material_composition,
            deposit: data.deposit,
            addedbyid,
            addedbyemail,
        }
    })
    return pass
}

export const updateProductPass = async (id, data) =>
    await prisma.pp_productPass.update({
        where: { id },
        data
    })

export const getProductPasses = async (page, limit, sort, moduleid) => {

    const skip = (page - 1) * limit;
    const passes = await prisma.pp_productPass.findMany({
        where: { moduleid },
        skip,
        take: limit,
        orderBy: sort,
    });
    const total = await prisma.pp_productPass.count();
    return { passes, total };
};


export const getProductPass = async (id) => {
    const pass = await prisma.pp_productPass.findUnique({
        where: { id },
        include: {
            pp_productImages: true,
            pp_assignedMaterial: true,
            pp_productDocuments: true,
            pp_subProductpass: true,
        }
    });
    return pass;
};

export const getProductPassByVID = async (vid) => {
    const pass = await prisma.pp_productPass.findUnique({
        where: { vid },
        include: {
            pp_productImages: true,
            pp_productDocuments: true
        }
    });
    return pass;
};

export const getProductPassByWSID = async (workspaceid) => {
    const pass = await prisma.pp_productPass.findUnique({
        where: { workspaceid },
        include: {
            pp_productImages: true,
            pp_productDocuments: true,
            pp_assignedMaterial: true,
            pp_subProductpass: true,
        }
    });
    return pass;
};


export const deleteProductPass = async (id) => {
    const doc = await prisma.pp_productPass.delete({
        where: { id },
    });
    return doc
}

// SUB PASS

export const createSubPass = async (addedbyid, addedbyemail, workspaceid, moduleid, data) => {

    const pass = await prisma.pp_subProductpass.createMany({
        data: {
            workspaceid,
            moduleid,
            vid: data.vid,
            passid: data.passid,
            pp_productPassid: data.pp_productPassid,
            tokenid: data.tokenid,
            addedbyid,
            addedbyemail,
        }
    })
    return pass
}

export const updateSubPass = async (id, data) =>
    await prisma.pp_subProductpass.update({
        where: { id },
        data
    })

export const getSubPasses = async (page, limit, sort, pp_productPassid) => {
    const skip = (page - 1) * limit;
    const passes = await prisma.pp_subProductpass.findMany({
        where: { pp_productPassid },
        skip,
        take: limit,
        orderBy: sort,
    });
    const total = await prisma.pp_subProductpass.count();
    return { passes, total };
};


export const getSubPass = async (id) => {
    const pass = await prisma.pp_subProductpass.findUnique({
        where: { id },

    });
    return pass;
};

export const getSubPassByPassid = async (passid) => {
    const pass = await prisma.pp_subProductpass.findUnique({
        where: { passid },
        include: {
            pp_checkIn: true,
            pp_checkOut: true,
        }
    });
    return pass;
};

// END SUB PASS

// CHECK IN

export const createCheckIn = async (data) => {

    const checkin = await prisma.pp_checkIn.createMany({
        data: {
            pp_productPassid: data.pp_productPassid,
            vid: data.vid,
            lat: data.lat.toString(),
            lng: data.lng.toString(),
            name: data.name,
            description: data.description,
            batch: data.batch,
            pp_subProductpassid: data.pp_subProductpassid,
        }
    })
    return checkin
}

// END CHECK IN

// CHECK IN

export const createCheckOut = async (data) => {

    const checkout = await prisma.pp_checkOut.createMany({
        data: {
            pp_productPassid: data.pp_productPassid,
            vid: data.vid,
            lat: data.lat.toString(),
            lng: data.lng.toString(),
            name: data.name,
            description: data.description,
            batch: data.batch,
            pp_subProductpassid: data.pp_subProductpassid,
        }
    })
    return checkout
}

// END CHECK IN

export const createProductPassImage = async (addedbyid, addedbyemail, workspaceid, moduleid, data, type, size, name) => {
    const image = await prisma.pp_productImages.createMany({
        data: {
            workspaceid,
            moduleid,
            pp_productPassid: data.pp_productPassid,
            url: data.url,
            vid: data.vid,
            type,
            size,
            name,
            addedbyid,
            addedbyemail,
        }
    })
    return image
}

export const deleteProductPassImage = async (id) => {
    const image = await prisma.pp_productImages.delete({
        where: { id },
    });
    return image
}

export const getProductPassImages = async (id) => {
    const images = await prisma.pp_productImages.findMany({
        where: { pp_productPassid: id },
    });
    return images;
};

export const updateProductPassImage = async (id, data) =>
    await prisma.pp_productImages.update({
        where: { id },
        data
    })

export const createProductPassDoc = async (addedbyid, addedbyemail, workspaceid, moduleid, data, type, size, name) => {
    const doc = await prisma.pp_productDocuments.createMany({
        data: {
            workspaceid,
            moduleid,
            pp_productPassid: data.pp_productPassid,
            url: data.url,
            vid: data.vid,
            type,
            size,
            name,
            addedbyid,
            addedbyemail,
        }
    })
    return doc
}



export const deleteProductPassDoc = async (id) => {
    const doc = await prisma.pp_productDocuments.delete({
        where: { id },
    });
    return doc
}

export const getProductPassDoc = async (id) => {
    const docs = await prisma.pp_productDocuments.findMany({
        where: { pp_productPassid: id },
    });
    return docs;
};

export const assignMaterial = async (addedbyid, addedbyemail, workspaceid, moduleid, data) => {
    const image = await prisma.pp_assignedMaterial.createMany({
        data: {
            workspaceid,
            moduleid,
            pp_productPassid: data.pp_productPassid,
            pp_materialsid: data.pp_materialsid,
            addedbyid,
            addedbyemail,
        }
    })
    return image
}

export const deleteAssignMaterial = async (id) => {
    const mats = await prisma.pp_assignedMaterial.delete({
        where: { id },
    });
    return mats
}