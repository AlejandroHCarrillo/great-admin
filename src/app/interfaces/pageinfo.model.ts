export class PageInfo {
    constructor(
        public first : number = 1,
        public rows: number = 1,
        public page: number = 1,
        public pageCount: number = 1,
        public sort: string = ""
        ){}
}