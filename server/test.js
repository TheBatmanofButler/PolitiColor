var regex = /(.)\1{2,}/

var s = "col".replace(regex, function(match, p1) { return p1+p1})

console.log(s)