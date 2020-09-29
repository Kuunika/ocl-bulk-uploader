export interface IOclBulkImportConcept {
    retired:       boolean;
    datatype:      string;
    type:          string;
    concept_class: string;
    source:        string;
    extras:        object;
    descriptions:  Description[];
    owner:         string;
    owner_type:    string;
    external_id:   null;
    id:            string;
    names:         Name[];
}

export interface Name {
    locale:           string;
    locale_preferred: boolean;
    external_id:      null;
    name:             string;
    name_type:        string;
}

export interface Description {
    description: string;
    locale: string;
}