
export const baseUrl = process.env.NEXT_PUBLIC_ASP_NET_URL;

export const apiLinks = {
    editor : {
        verify: `${baseUrl}/api/editor/verify`,
        reject: `${baseUrl}/api/editor/reject`,
        delete: `${baseUrl}/api/editor`  
    },
    newsletter:{
        fetch: `${baseUrl}/api/newsletter`,
        searchCategory: `${baseUrl}/api/newsletter/search?category=`,
        searchWriter: `${baseUrl}/api/newsletter/search?writer=`,
        searchTitle: `${baseUrl}/api/newsletter/search?title=`,
        verifiedArticles: `${baseUrl}/api/newsletter/verified`
    },
    category:{
        fetch: `${baseUrl}/api/category`,
    },
    comments:{
        fetch: `${baseUrl}/api/comments`,
    },
    user:{
        fetch: `${baseUrl}/api/users`
    },
    admin:{
        fetchUser: `${baseUrl}/api/admin/users`
    },
    notfication:{
        fetch: `${baseUrl}/api/notification`
    }
}