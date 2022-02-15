/**
 * @example const [err, data] = await to(promise);
 */
const to = (promise)=> promise
    .then((data) => ([undefined, data]))
    .catch((err) => ([err, undefined]));

module.exports = {to};
