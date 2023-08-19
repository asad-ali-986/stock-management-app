import fs from 'fs';

export function readJSONFile<T>(filePath: string): T {
    try{
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    }catch(err){
       throw err;
    }    
}