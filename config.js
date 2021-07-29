module.exports = {
  PORT: 3000,
  maxPerPage: 3,
  popularPostsMax: 5,
  recentPostsMax: 5,
  dateFormat: "DD.MM.YYYY HH:mm:ss",
  auth: {
    login: { minLength: 3, maxLength: 27 },
    password: { minLength: 5, maxLength: 27 },
    name: { minLength: 2, maxLength: 50 },
  },
  post: {
    title: { minLength: 5, maxLength: 100 },
    excerpt: { minLength: 50, maxLength: 227 },
    text: { minLength: 227, maxLength: 22700 },
    image: { types: ["jpeg", "png"], },
  },
  comment: {
    text: { minLength: 2, maxLength: 2270 },
  }
}