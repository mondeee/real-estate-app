const { getRequest, postRequest, tokenHeader, } = require("./requests");

export const checkoutPayment = async payload => await postRequest('checkouts', payload, { headers: tokenHeader()})