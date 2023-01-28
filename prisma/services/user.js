import { html, text } from '@/config/email-templates/api-generated';
import { sendMail } from '@/lib/server/mail';
import prisma from '@/prisma/index';

export const deactivate = async (id) =>
  await prisma.user.update({
    data: { deletedAt: new Date() },
    where: { id },
  });

// Get all users with pagnation and sorting
export const getAllUsers = async (page, limit, sort) => {
  const skip = (page - 1) * limit;
  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      company: true,
      userCode: true,
      apikey: true,
      role: true,
      secret: true,
      photo_url: true,
    },
    skip,
    take: limit,
    orderBy: sort,
  });
  const total = await prisma.user.count();
  return { users, total };
};

// fulltext search for users
export const searchUsers = async (search, page, limit, sort) => {
  const skip = (page - 1) * limit;
  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      company: true,
      userCode: true,
      apikey: true,
      role: true,
      secret: true,
      photo_url: true,
    },
    skip,
    take: limit,
    orderBy: sort,
    where: {
      OR: [
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          company: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    },

  });
  return users
}


export const getUser = async (id) =>
  await prisma.user.findUnique({
    select: {
      email: true,
      name: true,
      company: true,
      userCode: true,
      apikey: true,
      secret: true,
    },
    where: { id },
  });

export const updateEmail = async (id, email, previousEmail) => {
  await prisma.user.update({
    data: {
      email,
      emailVerified: null,
    },
    where: { id },
  });
  await sendMail({
    html: html({ email }),
    subject: `Vagabond - Email address updated`,
    text: text({ email }),
    to: [email, previousEmail],
  });
};

export const updateName = async (id, name) =>
  await prisma.user.update({
    data: { name },
    where: { id },
  });

export const updateCompany = async (id, company) =>
  await prisma.user.update({
    data: { company },
    where: { id },
  });

export const updateApi = async (id, email, previousEmail, apikey, secret) => {
  await prisma.user.update({
    data: {
      apikey,
      secret,
    },
    where: { id },
  });
  await sendMail({
    html: html({ email }),
    subject: `Vagabond - API Key generated`,
    text: text({ email }),
    to: [email, previousEmail],
  });
};


export const getActivities = async (page, limit, sort, id) => {
  const skip = (page - 1) * limit;

  const activities = await prisma.log.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      action: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },

    where: {
      userId: id,
    },
    skip,
    take: limit,
    orderBy: sort,
  });
  const total = await prisma.contact.count();
  return { activities, total }
}

export const getActivity = async (id, page) => {

  const allActivities = await prisma.log.findMany({
    where: { userId: id },
  });

  const activities = await prisma.log.findMany({
    skip: page > 0 ? parseFloat(page) * 10 : 0,
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    where: { userId: id },
  });
  return { activities, allActivities }
}