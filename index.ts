import { createOclBulkImportRequest, createOclMappingRequests } from './helper/axios-ocl';
import { createDhmisProductSchema } from "./csv_to_json_schema/dhamis_products.schema";
import { createNewOpenLmisProductSchema } from './csv_to_json_schema/new_open_lmis_products.schema';
import { map } from './mappingcsv/map-concept';

async function main(){
    
    const mappings = await map();

    await createOclMappingRequests('orgs/kuunika-registries/sources/DHIS2/mappings/',mappings);
    /*
    const concepts = await createDhmisProductSchema();
    try {
        await createOclBulkImportRequest(concepts);   
    } catch (error) {
        console.log(400);
    }
    */
    
}
main();