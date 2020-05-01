function processers(data) {
  try {
    var dataObj = JSON.parse(data);
    switch (dataObj.function) {
      case 'callError':
        break;
    }
  } catch (error) {
    console.log('socket message error', error)
  }
}
module.exports = processers;
