// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

// interface News {
//     id: string;
//     userId: string;
//     userName: string,
//     categoryId: string;
//     categoryName: string,
//     title: string;
//     editorContent: string;
//     postedOn: Date | null;
//     modifiedOn: Date | null;
//     isVerified: boolean;
//     isRejected: boolean;
//     coverImage: string;
// }


// interface ArticleStore {
//     setArticle: (article: News) => void;
// }



// export const useArticleStore = create(
//     persist<News & ArticleStore>(
//         (set) => ({
//             id: '',
//             userId: '',
//             userName:'',
//             categoryId: '',
//             categoryName: '',
//             title:'',
//             editorContent: '',
//             postedOn: null,
//             modifiedOn: null,
//             isVerified: false,
//             isRejected: false,
//             coverImage:'',
//             setArticle: (article) => set(() => ({...article}))
//         }),
//         {
//             name: 'article-storage',
//             storage: createJSONStorage(() => sessionStorage),
//         }
//     )
// )

// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

// interface News {
//     id: string;
//     userId: string;
//     userName: string,
//     categoryId: string;
//     categoryName: string,
//     title: string;
//     editorContent: string;
//     postedOn: Date | null;
//     modifiedOn: Date | null;
//     isVerified: boolean;
//     isRejected: boolean;
//     coverImage: string;
// }


// interface ArticleStore {
//     setArticle: (article: News) => void;
// }



// export const useArticleStore = create(
//     persist<News & ArticleStore>(
//         (set) => ({
//             id: '',
//             userId: '',
//             userName:'',
//             categoryId: '',
//             categoryName: '',
//             title:'',
//             editorContent: '',
//             postedOn: null,
//             modifiedOn: null,
//             isVerified: false,
//             isRejected: false,
//             coverImage:'',
//             setArticle: (article) => set(() => ({...article}))
//         }),
//         {
//             name: 'article-storage',
//             storage: createJSONStorage(() => sessionStorage),
//         }
//     )
// )

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


/////////////////////////////////SAVING NEWS TO DISPLAY ON EDITOR PAGE
interface News {
    id: string;
    userId: string;
    userName: string,
    categoryId: string;
    categoryName: string,
    title: string;
    editorContent: string;
    postedOn: Date | null;
    modifiedOn: Date | null;
    isVerified: boolean;
    isRejected: boolean;
    coverImage: string;
}

interface ArticleStore {
    setArticle: (article: News) => void;
}

interface Category {
    category_name: string;
}

// type MainNews = {
//     news_id : string;
//     category_id: string;
//     news_title: string;
//     content: string;
//     posted_on: string;
//     modified_on: string;
//     cover_image: string;
//     is_verified: boolean;
//     is_rejected: boolean;
//     Category: Category;
// }

type MainNews = {
    id: string;
    userId: string;
    userName: string;
    categoryId: string;
    categoryName: string;
    title: string;
    editorContent: string;
    postedOn: string;
    modifiedOn: string;
    coverImage: string;
    isVerified: boolean;
    isRejected: boolean;
  }

interface MainStore {
    setMainArticle: (article: MainNews) => void;
}

export const useArticleStore = create(
    persist<News & ArticleStore>(
        (set) => ({
            id: '',
            userId: '',
            userName:'',
            categoryId: '',
            categoryName: '',
            title:'',
            editorContent: '',
            postedOn: null,
            modifiedOn: null,
            isVerified: false,
            isRejected: false,
            coverImage:'',
            setArticle: (article) => set(() => ({...article}))
        }),
        {
            name: 'article-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)

export const useMainStore = create(
    persist<MainNews & MainStore>(
        (set) => ({
            id: '',
            userId: '',
            userName: '',
            categoryId: '',
            categoryName: '',
            title: '',
            editorContent: '',
            postedOn: '',
            modifiedOn: '',
            coverImage: '',
            isVerified: false,
            isRejected: false,
            setMainArticle: (article) => set(() => ({...article}))
        }),
        {
            name: 'main_article-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)




