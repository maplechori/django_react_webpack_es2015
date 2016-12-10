
module.exports = {

  logout: function() {
      console.log('User has been logged out');
      delete localStorage.token
  },

  loggedIn: function() {

    if (localStorage.token === "undefined" || localStorage.token === undefined)
    {
      console.log('User is not logged in');
      return false;
    }
      console.log('User is logged in');
      return !!localStorage.token

  },


}
