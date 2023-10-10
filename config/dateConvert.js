module.exports = function dateConvert(timeStr){
    const timeStamp = new Date(timeStr)
    const option = {day :'numeric',month:'short',year:'numeric'}

    const timeFormat = timeStamp.toLocaleString('en-Us',option)
    return timeFormat
}