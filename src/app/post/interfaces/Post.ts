export interface Post {
    value:        string[];
    formatters:   any[];
    contentTypes: any[];
    declaredType: null;
    statusCode:   number;
}

export interface Info {
    title:            string;
    publication_date: Date;
    imageUrl:         string;
    author:           string;
}
