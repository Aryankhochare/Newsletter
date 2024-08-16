
export const baseUrl = process.env.NEXT_PUBLIC_ASP_NET_URL;

export const apiLinks = {
    editor : {
        verify: `${baseUrl}/editor/verify`,
        reject: `${baseUrl}/editor/reject`,
        delete: `${baseUrl}/editor`  
    },

}