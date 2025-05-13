const express = require('express')
const router = express.Router()
const Payment = require ('../model/Payment')
const AppError = require("../utils/AppError");
// const { name } = require('../server');
// Make a new payment
router.post('/Pay', async (req, res, next) => {
    try{
        //Payment section
        const newPayment = new Payment({
            cardNumber: req.body.cardNumber,
            Pin: req.body.Pin,
            ExpiryDate: req.body.ExpiryDate
        });

        // Save Payment info
        const savedPayment = await newPayment.save()

        // Exclude the card PIN from the response
        const {Pin, ...PaymentwithoutPin} = savedPayment.toObject();
        res.status(200).json({
            status: 'success',
            Payment: PaymentwithoutPin
        })
    } catch (err) {
        if (err.name === 'ValidationError') {
            return next (new AppError(err.message, 400))
        }
        next(err)
    }
})
// Get all payments
router.get ('/id', async (req, res, next) => {
    try {
        const room = await Payment.findById(req.params.id);
        if(!Payment) {
            return next (new AppError ("Payment not made", 404)
            )
        }
        res.json(room)
    } catch(err) {
        next(err)
    }
})