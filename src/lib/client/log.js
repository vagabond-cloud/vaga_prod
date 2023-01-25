import api from "@/lib/common/api";

export const log = async (title, description, action, ip) => {
    const res = await api('/api/logs', {
        method: 'POST',
        body: {
            title,
            description,
            action,
            ip,
        }
    });
    return res
};

export const contactActivity = async (title, description, action, ip, contactId) => {
    const res = await api('/api/modules/activities', {
        method: 'POST',
        body: {
            title,
            description,
            action,
            ip,
            contactId,
        }
    });
    return res
};
