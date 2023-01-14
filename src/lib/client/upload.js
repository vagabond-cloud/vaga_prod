
export const uploadToGCS = async (file, type) => {

    const body = new FormData();
    body.append("file", file);
    const data = await fetch("/api/system/upload", {
        method: "POST",
        body

    });

    const getUrl = await new Response(data.body).json()

    if (getUrl?.data?.fileUrl) {

        return getUrl?.data?.fileUrl
    }
};