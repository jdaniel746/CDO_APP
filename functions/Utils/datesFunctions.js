module.exports.getWeekNumber = function(date){
  const startDate = new Date(date.getFullYear(), 0, 1);
  let days = Math.floor((date - startDate) /
    (24 * 60 * 60 * 1000));

  return Math.ceil(days / 7)
}



