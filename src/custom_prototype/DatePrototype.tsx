declare global {
  interface Date {
    monthNames: string[],
    dayNames: string[],
    getMonthName: () => string,
    getDayName: () => string
  }
}

Date.prototype.monthNames = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];

Date.prototype.dayNames = [
  "Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday",
  "Saturday"
];

Date.prototype.getMonthName = function() {
  return this.monthNames[this.getMonth()];
};

Date.prototype.getDayName = function () {
  return this.dayNames[this.getDay()];
}

export {}
