const mongoose = require('mongoose');
mongoose.set({ strictPopulate: false })

module.exports = ()=> mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

