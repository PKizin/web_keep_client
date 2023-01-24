declare global {
  interface Date {
    monthNames: string[],
    getMonthName: () => string,
    getShortMonthName: () => string
  }
}

Date.prototype.monthNames = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];

Date.prototype.getMonthName = function() {
  return this.monthNames[this.getMonth()];
};

Date.prototype.getShortMonthName = function () {
  return this.getMonthName().substr(0, 3);
};

export {}
