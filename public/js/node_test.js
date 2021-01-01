function callback(word, index, char) {
    return word.charAt(this.index) == this.char;
}

words = ['aaa', 'abc', 'bbbb'];
var filter_array = words.filter(callback, {index: 0, char: 'a'});
console.log(filter_array);