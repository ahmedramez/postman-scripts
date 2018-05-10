function sum(num1, num2) {
    return num1 + num2;
}





expect(sum(1, 2)).to.equal(4);







//building framework

function expect(value) {
    return {
        to: {
            equal: function (result) {
                if (value == result) {
                    console.log("Test Case Succeded");
                }
                else {
                    console.log("Test Case Failed :expect " + value + " to be " + result);
                }
            }
        }
    }
}