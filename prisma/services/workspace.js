import { InvitationStatus, TeamRole } from '@prisma/client';
import slugify from 'slugify';
import { log } from '@/lib/server/logsnag';

import {
  html as createHtml,
  text as createText,
} from '@/config/email-templates/workspace-create';
import {
  html as inviteHtml,
  text as inviteText,
} from '@/config/email-templates/invitation';
import { sendMail } from '@/lib/server/mail';
import prisma from '@/prisma/index';

export const countWorkspaces = async (slug) =>
  await prisma.workspace.count({
    where: { slug: { startsWith: slug } },
  });

export const createWorkspace = async (creatorId, email, name, slug) => {
  const count = await countWorkspaces(slug);

  if (count > 0) {
    slug = `${slug}-${count}`;
  }

  const workspace = await prisma.workspace.create({
    data: {
      creatorId,
      members: {
        create: {
          email,
          inviter: email,
          status: InvitationStatus.ACCEPTED,
          teamRole: TeamRole.OWNER,
        },
      },
      name,
      slug,
    },
  });


  log(
    'create_workspace',
    'New Workspace Created',
    `A new workspace was recently created. (${email})`
  ),

    await sendMail({
      html: createHtml({ code: workspace.inviteCode, name }),
      subject: `Vagabond Workspace created: ${name}`,
      text: createText({ code: workspace.inviteCode, name }),
      to: email,
    });


};

export const deleteWorkspace = async (id, email, slug) => {
  const workspace = await getOwnWorkspace(id, email, slug);

  if (workspace) {
    await prisma.workspace.update({
      data: { deletedAt: new Date() },
      where: { id: workspace[0].id },
    });
    return slug;
  } else {
    throw new Error('Unable to find workspace');
  }
};

export const getInvitation = async (inviteCode) =>
  await prisma.workspace.findUnique({

    where: {
      inviteCode,
    },
  });

export const getOwnWorkspace = async (id, email, slug) =>
  await prisma.workspace.findMany({
    where:
    {
      creatorId: id,
      slug
    },

  });

export const getSiteWorkspace = async (slug, customDomain) =>
  await prisma.workspace.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      domains: { select: { name: true } },
    },
    where: {
      OR: [
        { slug },
        customDomain
          ? {
            domains: {
              some: {
                name: slug,
              },
            },
          }
          : undefined,
      ],
    },
  });

export const getWorkspace = async (id, email, slug) =>
  await prisma.workspace.findMany({
    where: {
      OR: [
        {
          id,
          slug
        },
        {
          members: {
            some: {
              email,
            },
          },
        },
      ],
      AND: {
        slug
      }
    },
    include: {
      members: true
    }

  });

export const getWorkspaces = async (id, email) =>
  await prisma.workspace.findMany({
    where: {
      OR: [
        {
          id,
        },
        {
          members: {
            some: {
              email,
              status: InvitationStatus.ACCEPTED,
            },
          },
        },
      ],
    },
  });

export const getWorkspacePaths = async () => {
  const [workspaces, domains] = await Promise.all([
    prisma.workspace.findMany({
      select: { slug: true },
    }),
    prisma.domain.findMany({
      select: { name: true },
    }),
  ]);

  return [
    ...workspaces.map((workspace) => ({
      params: { site: workspace.slug },
    })),
    ...domains.map((domain) => ({
      params: { site: domain.name },
    })),
  ];
};

export const inviteUsers = async (id, email, members, slug) => {
  const workspace = await getOwnWorkspace(id, email, slug);
  const inviter = email;


  if (workspace) {
    const membersList = members.map(({ email, role }) => ({
      email,
      inviter,
      teamRole: role,
    }));
    const data = members.map(({ email }) => ({
      createdAt: null,
      email,
    }));
    await Promise.all([
      prisma.user.createMany({
        data,
      }),
      prisma.workspace.update({
        where: { id: workspace[0].id },
        data: {
          members: {
            createMany: {
              data: membersList,
            },
          },
        },
      }),
      sendMail({
        html: inviteHtml({ code: workspace[0].inviteCode, name: workspace[0].name }),
        subject: `Vagabond - You have been invited to join ${workspace[0].name} workspace`,
        text: inviteText({ code: workspace[0].inviteCode, name: workspace[0].name }),
        to: members.map((member) => member.email),
      }),
    ]);
    return membersList;
  } else {
    throw new Error('Unable to find workspace');
  }
};

export const isWorkspaceCreator = (id, creatorId) => id === creatorId;

export const isWorkspaceOwner = (email, workspace) => {
  let isTeamOwner = false;

  const member = workspace[0]?.members.find(
    (member) => member.email === email && member.teamRole === TeamRole.OWNER
  );

  if (member) {
    isTeamOwner = true;
  }

  return isTeamOwner;
};

export const joinWorkspace = async (workspaceCode, id, email) => {
  const workspace = await prisma.workspace.findUnique({
    select: {
      creatorId: true,
      id: true,
    },
    where: {
      workspaceCode,
    },
  });

  if (workspace) {
    await prisma.member.upsert({
      where: { id },
      create: {
        workspaceId: workspace.id,
        email,
        inviter: workspace.creatorId,
        status: InvitationStatus.ACCEPTED,
      },
      update: {},
    });
    return new Date();
  } else {
    throw new Error('Unable to find workspace');
  }
};

export const updateName = async (id, email, name, slug) => {
  const workspace = await getOwnWorkspace(id, email, slug);

  if (workspace) {
    await prisma.workspace.update({
      data: { name },
      where: { id: workspace.id },
    });
    return name;
  } else {
    throw new Error('Unable to find workspace');
  }
};

export const updateSlug = async (id, email, newSlug, pathSlug) => {
  let slug = slugify(newSlug.toLowerCase());
  const count = await countWorkspaces(slug);

  if (count > 0) {
    slug = `${slug}-${count}`;
  }

  const workspace = await getOwnWorkspace(id, email, pathSlug);

  if (workspace) {
    await prisma.workspace.update({
      data: { slug },
      where: { id: workspace.id },
    });
    return slug;
  } else {
    throw new Error('Unable to find workspace');
  }
};
