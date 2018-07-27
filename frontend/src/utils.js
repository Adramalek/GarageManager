function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function preventDefaultDecorator(wrapped){
    return function (e) {
        e.preventDefault();
        wrapped.apply(this, arguments)
    }
}

function curryIt(uncurried) {
    let parameters = Array.prototype.slice.call(arguments, 1);
    return function() {
        return uncurried.apply(this, parameters.concat(
            Array.prototype.slice.call(arguments, 0)
        ));
    };
}

export {capitalizeFirstLetter, preventDefaultDecorator, curryIt}