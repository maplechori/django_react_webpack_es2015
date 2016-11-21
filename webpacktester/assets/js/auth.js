
module.exports = {

  logout: function() {
      delete localStorage.token
  },

  loggedIn: function() {
      return !!localStorage.token
  },

  
}
