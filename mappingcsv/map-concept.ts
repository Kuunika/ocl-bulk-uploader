import { promises as fs } from "fs";
import * as csv from 'csvtojson';
import { INewOpenLmisProduct } from "../csv/new_open_lmis_products.type";
import { MappingPayload } from "../helper/axios-ocl";
import { IDmisProducts } from "../csv/dhmis.interface";

export async function map() {
    const dhis2_csv = '/Users/brettonions/Documents/GitHub/ocl-bulk-uploader/mappingcsv/orgs_sample-test-dev-kuunika_sources_dhis2-dev_head_concepts.csv';
    const dhmis_csv = '/Users/brettonions/Documents/GitHub/ocl-bulk-uploader/mappingcsv/orgs_sample-test-dev-kuunika_sources_dhmis-dev_head_concepts.csv';
    const master_list_csv = '/Users/brettonions/Documents/GitHub/ocl-bulk-uploader/mappingcsv/orgs_kuunika-registries_sources_masterlist_head_concepts.csv';
    const open_lmis_csv = '/Users/brettonions/Documents/GitHub/ocl-bulk-uploader/mappingcsv/orgs_sample-test-dev-kuunika_sources_openlmis-dev_head_concepts.csv';

    const dhis2_json = await csv().fromFile(dhis2_csv) as IDmisProducts[];
    const dhmis_json = await csv().fromFile(dhmis_csv) as IDmisProducts[];
    const master_list_json = await csv().fromFile(master_list_csv) as IDmisProducts[];
    const open_lmis_json = await csv().fromFile(open_lmis_csv) as IDmisProducts[];

    const mappings = master_list_json.map((concept): MappingPayload => {
        const found = dhis2_json.find(dhis2 => dhis2["Preferred Name"] === concept["Preferred Name"]);
        
        if(!found) {
            return undefined;
        }
            
        return {
            map_type: "Same As",
            to_concept_url:  `/orgs/kuunika-registries/sources/MasterList/concepts/${concept["Concept ID"]}/`,
            from_concept_url:`/orgs/kuunika-registries/sources/DHIS2/concepts/${found["Concept ID"]}/`,
        }
    }).filter(mapping => mapping !== undefined);
    
    return mappings;
}

