import { bodyGetter } from '../utils/body-getter.js'; 

function csv() {
    return async (req, res, next) => {
        if(req.headers['content-type'] && req.headers['content-type'].toLowerCase() === 'text/csv') {
            try {
                let content = await bodyGetter(req);
                req.body = parseCSV(content.toString());
            } catch (err) {
                res.status(400).send(err);
            }
        }
        next();
    };
}

function parseCSV(content) {
    //Array of Objects
    let result = [];
    console.log(content);
    if(!content)
        throw 'csv parsing error. no content';

    let rows = content.toString().split('\r');
    let rowsf = rows.toString().split(',');
    let rowsh = rowsf.toString().split('\n');
    let rowsw = rowsh.toString().split(',');
    rows = [];
    for(let i = 0;i < rowsw.length;i+=2) {
        rows.push(rowsw[i]);
    }
    
    if(rows.length < 1)
        throw 'csv parsing error. no header or no string';

    let keys = rows[0].split(';');
    if(keys.length < 1)
        throw 'csv parsing error.no header columns';
    for(let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        let o = {};
        let cols = rows[rowIdx].split(';');
      //  console.log(rows);
      //  console.log(cols);
      //  console.log("\n");
        if(cols.length != keys.length){
            throw "number of columns not equal to number of keys!";
        }
       
        for(let colIdx = 0; colIdx < keys.length; colIdx++) {
            if(!keys[colIdx])
                throw 'number of columns not equal to number of columns in header-row';
            o[keys[colIdx]] = cols[colIdx];
        }
        result.push(o);
    }
    return result;
}

export { csv };