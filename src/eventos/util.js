const leftZero = (value , size ) => {
    let s = value + '';
    while (s.length < size) s = '0' + s;
    return s;
  };


  const convertToAAAAMMDD = (fecha ) =>{
    return (
      fecha.getFullYear() +
       leftZero(fecha.getMonth() + 1, 2) +
      leftZero(fecha.getDate(), 2)
    );
  }
  const convertToJSONFormat =(fecha ) =>{
    return (
      fecha.getFullYear() +
      '-' +
      leftZero(fecha.getMonth() + 1, 2) +
      '-' +
      leftZero(fecha.getDate(), 2) +
      'T' +
      leftZero(fecha.getHours(), 2) +
      ':' +
      leftZero(fecha.getMinutes(), 2) +
      ':' +
      leftZero(fecha.getSeconds(), 2)
    );
  }

  const isIsoDateTime = (str ) =>{
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str)) return false;
    var d = new Date(str + '.000Z');
    return d.toISOString() === str + '.000Z';
  }

  const isIsoDate = (str )=> {
    if (!/\d{4}-\d{2}-\d{2}/.test(str)) return false;
    return true; 
  }

  module.exports = { isIsoDate, isIsoDateTime,convertToJSONFormat ,convertToAAAAMMDD ,leftZero};
