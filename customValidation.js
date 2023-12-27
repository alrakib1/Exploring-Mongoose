const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, //for email validation we can use unique true for user data
  },
  phone: {
    type: Number,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});


// we can use custom validation using validate on mongoose like on the top.