module.exports = async function() {
  // Close the page if it exists
  if (global.__PAGE__) {
    try {
      await global.__PAGE__.close();
    } catch (error) {
      console.error('Error closing page:', error);
    }
  }
  
  // Close the browser if it exists
  if (global.__BROWSER__) {
    try {
      await global.__BROWSER__.close();
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }
};
