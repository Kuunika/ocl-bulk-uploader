import * as csv from 'csvtojson';

export async function csvToJson<T>(filePathToCsv: string):Promise<T[]>{
    const jsonArray = await csv().fromFile(filePathToCsv);
    return jsonArray;
}