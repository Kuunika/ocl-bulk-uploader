import { IOclBulkImportSource } from '../interface/ocl-bulk-import-source.interface';
import { IOclBulkImportConcept } from '../interface/ocl-bulk-import-concept.interface';
import { csvToJson } from '../helper/csv-to-json-wrapper';
import * as path from 'path'
import * as uuid from 'uuid';
import * as dotenv from 'dotenv';
import { IDmisProducts } from '../csv/dhmis.interface';

dotenv.config();

export async function createDhmisProductSchema():Promise<[IOclBulkImportSource,IOclBulkImportConcept[]]>{
    
    //TODO: Use .env to set the csv file names to avoid magic strings.
    const pathToCsv = path.join(__dirname, '../csv/dhmis.csv');
    console.log(pathToCsv);
    const jsonFromCsv = await csvToJson<IDmisProducts>(pathToCsv);
    
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
                    name:             concept["Preferred Name"],
                    name_type: 'Concept Name'
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
