
export const baseUrl = process.env.NEXT_PUBLIC_ASP_NET_URL;

export const apiLinks = {
    editor : {
        verify: `${baseUrl}/editor/verify`,
        reject: `${baseUrl}/editor/reject`,
        delete: `${baseUrl}/editor`  
    },
    newsletter:{
        fetch: `${baseUrl}/newsletter`,
        searchCategory: `${baseUrl}/newsletter/search?category=`,
        searchWriter: `${baseUrl}/newsletter/search?writer=`,
        verifiedArticles: `${baseUrl}/newsletter/verified`
    },
    category:{
        fetch: `${baseUrl}/api/category`,
    },
    comments:{
        fetch: `${baseUrl}/api/comments`,
    },
    user:{
        fetch: `${baseUrl}/users`
    },
    admin:{
        fetchUser: `${baseUrl}/admin/users`
    },
    notfication:{
        fetch: `${baseUrl}/api/notification`
    }
}