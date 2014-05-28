var db      = mongoose.connection;
var Schema  = mongoose.Schema;

db.on('error', function (err) {
    console.log('Db connection error');
    //try here work with js-exceptions
});

db.once('open', function callback() {
    console.log('Connected to medAppDb');
    var patientSchema       = Schema({
        name            : String,
        id              : Number,
        currentOrders   : [Schema.Types.ObjectId]
    });

    var orderSchema         = Schema({
        patientId   : Number,
        orderId     : Number,
        priority    : Number,  //0-urgnet, 1-normal, 2-low
        comment     : String,
        diagnosis   : String,
        specimens   : [{setup: Schema.Types.ObjectId, status: String}],
        //tests     : [{setup: Schema.Types.ObjectId, status: String, results: []}]
        status      : String
    });

    var specimenSetupSchema = Schema({
        name        : String,
        volume      : Number
    });

    orderSchema.post('save', function(doc){
        Patient.update({id: doc.patientId}, {$pushAll: {currentOrders: [doc.id]}}, function(err){
            console.log(err);
        });
        console.log('%s has been added to orders', doc.orderId);
    });

    var Patient             = mongoose.model('Patient', patientSchema);
    var Order               = mongoose.model('Order', orderSchema);
    var SpecimenSetup       = mongoose.model('SpecimenSetup', specimenSetupSchema);

//    Patient.create({
//        name    : 'Jhon Smith',
//        id      : 109
//    }, function(err, patient){
//        console.log(patient);
//    });

//    Order.create({
//        orderId     : 209,
//        patientId   : 103,
//        comment     : 'Update patient by trigger'
//    });
    Order.update({orderId: 209}, {$set: {comment: 'Order was updated'}}, function(err){
       if (err) console.log(err);
    });
//    Order.findOne({},function(err, order){
//        console.log('Orders');
//        console.log(order);
//        console.log('Order _id');
//        console.log(order.id);
//        Patient.update({id: 103},{$pushAll: {currentOrders: [order.id]}}, function(err){
//            if (err) {
//                console.log(err);
//            } else {
//                console.log('Patient had been updated')
//            }
//        });
//    });

    var findAllPatientOrders = function(patientId){
        Patient.findOne({id: patientId},function(err, patient){
            for (var i = 0; i<patient.currentOrders.length; i++){
                Order.find({_id: patient.currentOrders[i]}, function(err, order){
                    console.log('Some output');
                    console.log(order);
                });
            }
        });
    };

//    findAllPatientOrders(103);

//    Patient.findOne({id: 103}, function(err, patient) {
//        console.log('Patients');
//        console.log(patient.currentOrders.length);
//    });
});




