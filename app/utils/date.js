export default function date({ date }) {
    function getDateWeek(date) {
        const currentDate = 
            (typeof date === 'object') ? date : new Date();
        const januaryFirst = 
            new Date(currentDate.getFullYear(), 0, 1);
        const daysToNextMonday = 
            (januaryFirst.getDay() === 1) ? 0 : 
            (7 - januaryFirst.getDay()) % 7;
        const nextMonday = 
            new Date(currentDate.getFullYear(), 0, 
            januaryFirst.getDate() + daysToNextMonday);
     
        return (currentDate < nextMonday) ? 52 : 
        (currentDate > nextMonday ? Math.ceil(
        (currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
    }
     
    const currentDate = new Date();
    const weekNumber = getDateWeek();
     
    console.log("Week number of " + currentDate + " is : " + weekNumber);

}
