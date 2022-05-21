const numberToWord = (n: number) => {
    if (n == 1) {
      return '1st';
    } else if (n == 2) {
      return '2nd';
    } else if (n == 3) {
      return '3rd';
    } else {
      return `${n}th`;
    }
}

export { numberToWord }