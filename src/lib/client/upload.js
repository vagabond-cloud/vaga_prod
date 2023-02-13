export const uploadToGCS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/system/upload", { method: "POST", body: formData });
    const responseJson = await response.json();
    return responseJson.data?.fileUrl;
};
