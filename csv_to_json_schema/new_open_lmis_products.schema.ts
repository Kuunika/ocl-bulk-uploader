import { INewOpenLmisProduct } from '../csv/new_open_lmis_products.type';
import { IOclBulkImportSource } from '../interface/ocl-bulk-import-source.interface';
import { IOclBulkImportConcept } from '../interface/ocl-bulk-import-concept.interface';
import { csvToJson } from '../helper/csv-to-json-wrapper';
import { promises as fs } from "fs";
import * as path from 'path'
import * as uuid from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

export async function createNewOpenLmisProductSchema():Promise<[IOclBulkImportSource,IOclBulkImportConcept[]]>{
    
    //TODO: Use .env to set the csv file names to avoid magic strings.
    const pathToCsv = path.join(__dirname, '../csv/OpenLMIS data elements - to be used to create AMC and MoS - Original DHIS2 Extract.csv');
    console.log(pathToCsv);
    const jsonFromCsv = await require('../csv/openlmis.json') as INewOpenLmisProduct[];

    
    const oclConcepts: IOclBulkImportConcept[] = jsonFromCsv.map(concept => {
        return {
            retired:       false,
            datatype:      'Text',
            type:          'Concept',
            concept_class: 'Medical-supply',
            source:        process.env.MASTER_LIST_SOURCE_NAME,
            extras:        null,
            descriptions:  null,
            owner:         process.env.OWNER,
            owner_type:    process.env.OWNER_TYPE,
            external_id:   null,
            id:            uuid.v4(),
            names:         [
                {
                    locale:           'en',
                    locale_preferred: true,
                    external_id:      null,
                    name:             concept.shortName,
                    name_type:        'Master List Name',// Need to be changed based on the source ti is going to
                }
            ],
        }
    });

    return [
    {
        type: 'Source',
        id: process.env.MASTER_LIST_SOURCE_NAME,
        short_code: process.env.MASTER_LIST_SOURCE_NAME,
        name: process.env.MASTER_LIST_SOURCE_FULL_NAME,
        full_name: process.env.MASTER_LIST_SOURCE_FULL_NAME,
        owner: process.env.OWNER,
        owner_type: process.env.OWNER_TYPE,
        description: "",
        source_type: "Dictionary",
        public_access: "View",
        default_locale: "en",
        supported_locales: "ny",
        custom_validation_schema: "None"
    },
    oclConcepts];
}