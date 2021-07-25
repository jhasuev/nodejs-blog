module.exports = {
  PORT: 3000,
  form: {
    login: {
      minLength: 3,
      maxLength: 27,
    },
    password: {
      minLength: 5,
      maxLength: 27
    },
    name: {
      minLength: 2,
      maxLength: 50
    },
  },
}