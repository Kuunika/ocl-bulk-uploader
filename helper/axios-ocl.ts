import * as axios from 'axios';
import { IOclBulkImportSource } from '../interface/ocl-bulk-import-source.interface';
import { IOclBulkImportConcept } from '../interface/ocl-bulk-import-concept.interface';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { type } from 'os';
dotenv.config();

export type MappingPayload = {
    "map_type": string,
    "from_concept_url": string,
    "to_concept_url": string,
}


export async function createOclBulkImportRequest(schema: [IOclBulkImportSource,IOclBulkImportConcept[]]){
    const url = process.env.OCL_BASE_URL + process.env.OCL_CREATE_NEW_CONCEPT
    const apiKey = process.env.OCL_API_KEY;
    const data = JSON.stringify(schema[0]) + '\n' + schema[1].reduce((acc, val) => acc + JSON.stringify(val) + '\n', '');
    for (const concept of schema[1]) {
        try {
            const request = await axios.default({
                headers:{
                    Authorization: apiKey
                },
                url,
                method: "POST",
                data: concept
            });
            console.log(request.status);
        } catch (error) {
            console.log(JSON.stringify(error));
            
            console.log(400);
        }
        
    }
}

export async function createOclMappingRequests(url: string, mappingPayload: MappingPayload[]) {
    const apiKey = process.env.OCL_API_KEY;
    const baseUrl = process.env.OCL_BASE_URL;
        for (const mapping of mappingPayload) {
            try {
                await axios.default({
                    headers:{
                        Authorization: apiKey
                    },
                    url: baseUrl + url,
                    method: "POST",
                    data: mapping
                });
                console.log(201);
                
            } catch (error) {
                console.log(JSON.stringify(error));
                //console.log(400 + ' concepts Does Not exist');
            }
        }
    
}