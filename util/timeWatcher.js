const getCurrentDateTimeInGMT = ()=> {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();

    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth() + 1; // Months are zero-based
    const day = currentDate.getUTCDate();
    const hours = currentDate.getUTCHours();
    const minutes = currentDate.getUTCMinutes();
    const seconds = currentDate.getUTCSeconds();
    const milliseconds = currentDate.getUTCMilliseconds();
    const dayOfWeekString = daysOfWeek[currentDate.getUTCDay()];
    const dayOfWeek = currentDate.getUTCDay();
    
    
    return {
        year,
        month,
        day,
        hours,
        minutes,
        seconds,
        milliseconds,
        dayOfWeekString,
        dayOfWeek
    }

}

module.exports= getCurrentDateTimeInGMT;