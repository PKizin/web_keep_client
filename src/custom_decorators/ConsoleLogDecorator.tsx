function ConsoleLog () {
  console.log('Console Log Decorator evaluated')
  return function (target: any) {
    console.log('Console Log Decorator called')
  }
}

export { ConsoleLog }
