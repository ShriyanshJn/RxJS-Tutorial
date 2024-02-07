//* 1.OBSERVABLE emits data -> 2.Data goes through PIPE -> 3.OBSERVER receives the data

const { Observable } = require("rxjs")

//* Observable takes a callback with param as a subscriber
// We emit data inside the callback, also an observable can emit multiple data
const observable = new Observable((subscriber) => {
    // To emit data we do subscriber.next()
    subscriber.next(10)
    subscriber.next(11)
    subscriber.next(12)
})


const observer = {

    // C1:- Observer gets some data and everything's fine and it will process the data
    // value is the data which the observer gets after the data's processed from pipe
    next: (value) => { console.log("Observer got a value of " + value) },

    // C2:- Observer gets error from the pipe 
    error: (err) => { console.log("Observer got an error of " + err) },

    // C3:- Observable is complete
    complete: () => { console.log("Observer got a complete notification") }
}


// Connecting observer with observable
observable.subscribe(observer)