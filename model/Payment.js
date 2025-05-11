const mongoose = require('mongoose')

const PaySchema = new mongoose.schema ({
    CardNumber:{
        type: String,
        required:true,

    },
    Pin: {
        type: Number,
        required:true,
    },
    ExpiryDate: {
        type: Number,
        required:true
    }
})

const Payment = mongoose.model("Payment", PaySchema)

module.exports = Payment