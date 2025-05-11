const express = require ('express')
const Payment = require('../model/Payment')

const paymentController = {
// Get all Payments info
GetAllpayments: async (req, res) => {
    try{
        const payments = await Payment.find(req.params)
        .populate('CardNumber', 'Pin ExpiryDate')
        .sort({cardNumber: 1});
        res.json(payments);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
},

// Make new Payments
makePayment: async (req, res) => {
    try{
        const newPayment = new Payment(req.body);
        const savedPayment = await new Payment.save()
        res.status(200).json(savedPayment);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
};

module.exports = paymentController