function bodyGetter(req) {
    return new Promise((resolve, reject) => {
        let buffer = [];
        req.on('error', err => {
            reject(err);
        });

        req.on('data', chunk => {
            try {
                buffer.push(chunk);
            } catch (err) {
                reject(err);
            }
        });

        req.on('end', () => {
            resolve(buffer);
        });
    });
}

export { bodyGetter };