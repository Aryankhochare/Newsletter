import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
