const { getRequest, postRequest, tokenHeader, multiPartHeader, } = require("./requests");

export const checkoutPayment = async payload => await postRequest('checkouts', payload, { headers: tokenHeader()})