import { Theme } from "next-auth";

declare module 'react-quill'{
    import { ComponentType } from "react";
    
    export type ReactQuillProps = {
        value?:string;
        onChange?:(value:string) => void;
        placeholder?:string;
        module?:object;
        formats?:string[];
        themes?:Theme
    };

    const ReactQuill : ComponentType<ReactQuillProps>;
    export default ReactQuill;
}