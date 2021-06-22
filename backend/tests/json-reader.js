import fs from 'fs';

let getData = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        let parsedData = JSON.parse(data);
        resolve(parsedData);
      } catch (parsingErr) {
        reject(parsingErr);
      }
    });
  });
};

export default getData;
