import fs from 'fs';

let readJSON = function(path) {
    return new Promise((resolve, reject)=>{
        fs.readFile(path, (error,data) =>{
            if(error){
                reject(error);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

export { readJSON };
