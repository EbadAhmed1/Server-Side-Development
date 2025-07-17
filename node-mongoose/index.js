const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion'; 

// Connect to MongoDB
mongoose.connect(url)
.then((db) => {
    console.log('Connected correctly to server');
    
    // Create a new dish
    return Dishes.create({
        name: 'Uthappizza',
        description: 'test'
    });
})
.then((dish) => {
    console.log(dish);

    // Update the dish's description
    return Dishes.findByIdAndUpdate(
        dish._id, 
        { $set: { description: 'Updated test' } },
        { new: true }  // Return the updated document
    ).exec();
})
.then((dish) => {
    console.log(dish);

    // Add a comment to the dish
    dish.comments.push({
        rating: 5,
        comment: 'I\'m getting a sinking feeling!',
        author: 'Leonardo di Carpaccio'
    });

    // Save the dish with new comment
    return dish.save();
})
.then((dish) => {
    console.log(dish);

    // Delete all dishes (cleanup)
    return Dishes.deleteMany({});
})
.then(() => {
    // Close the connection
    return mongoose.connection.close();
})
.catch((err) => {
    console.log('Error:', err);
});