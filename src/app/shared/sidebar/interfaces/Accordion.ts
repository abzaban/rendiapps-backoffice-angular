export interface Accordion {
    icon:string;
    title:string;
    path:string;
    expanded:boolean;
    childrens?: Accordion[]
}