
module.exports = {

  logout: function() {
      delete localStorage.token
  },

  loggedIn: function() {

    if (localStorage.token === "undefined" || localStorage.token === undefined)
    {
      return false;
    }
      return !!localStorage.token

  },


}
