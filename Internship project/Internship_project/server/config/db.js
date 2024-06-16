const mongoose = require('mongoose');

const connectDB = async () => {
  const connectWithRetry = () => {
    const mongoose = require('mongoose');

main()
.then(() => {
    console.log("connections Established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blog_website');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
  };
  
  connectWithRetry();
};



module.exports = connectDB;
