import * as csv from 'csvtojson';
import { promises as fs } from 'fs';
import { IDmisProducts } from './csv/dhmis.interface';
import { INewOpenLmisProduct } from './csv/new_open_lmis_products.type';
import { createOclMappingRequests, MappingPayload } from "./helper/axios-ocl";

const pathToOpenLmisCsvFile = '/Users/brettonions/Documents/GitHub/ocl-bulk-uploader/csv/OpenLMIS data elements - to be used to create AMC and MoS - Original DHIS2 Extract.csv';
const pathToMasterListCsvFile = '/Users/brettonions/Documents/GitHub/ocl-bulk-uploader/csv/orgs_mw-product-master_sources_master-list_head_concepts.csv';
const pathToOldOpenLMISProduct = '/Users/brettonions/Documents/GitHub/ocl-bulk-uploader/csv/orgs_mw-product-master_sources_openlmis_head_concepts 3.csv';

async function main(){
    const jsonOpenLmis = await csv().fromFile(pathToOpenLmisCsvFile) as INewOpenLmisProduct[]
    const jsonMasterList = await csv().fromFile(pathToMasterListCsvFile) as IDmisProducts[];
    const jsonOldOpenLmisProducts = await csv().fromFile(pathToOldOpenLMISProduct) as IDmisProducts[];

    const masterListOrgUrl = '/orgs/mw-product-master/sources/Master-List/concepts/';
    const openLmisOrgUrl = '/orgs/mw-product-master/sources/OpenLMIS/concepts/';

    const mappings = jsonMasterList.map((concept): MappingPayload => {
        const found = jsonOpenLmis.find(openLmis => openLmis.shortName === concept["Preferred Name"]);
        
        if(!found) {
            return undefined;
        }

        const match = jsonOldOpenLmisProducts.find(product => product["Concept ID"] === found.code);
        
        if(match){
            
            return {
                map_type: "Same As",
                from_concept_url: `${openLmisOrgUrl}${match["Concept ID"]}/`,
                to_concept_url: `${masterListOrgUrl}${concept["Concept ID"]}/`,
            }
        }
    }).filter(mapping => mapping !== undefined);

    
    await createOclMappingRequests('orgs/mw-product-master/sources/OpenLMIS/mappings/', mappings);


}

main();