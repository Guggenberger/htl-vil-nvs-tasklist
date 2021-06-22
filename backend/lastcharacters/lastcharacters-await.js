import { checkQueryString, readData, getResponseData } from './lastcharacters-promise.js';

async function readLastCharAwait(req, res) {
    checkQueryString(req, res).catch(() => {});
    let data = await readData(req, res).catch(()=> {});
    await getResponseData(req, res, data).catch(()=> {});
}

export { readLastCharAwait }