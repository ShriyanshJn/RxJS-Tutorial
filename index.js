//* 1.OBSERVABLE emits data -> 2.Data goes through PIPE -> 3.OBSERVER receives the data

const { Observable, pluck, filter, map } = require("rxjs")

const users = {
    data: [
        {
            status: "active",
            age: 19,
        },
        {
            status: "inactive",
            age: 43,
        },
        {
            status: "inactive",
            age: 11,
        },
        {
            status: "active",
            age: 29,
        },
        {
            status: "inactive",
            age: 35,
        },
        {
            status: "active",
            age: 18,
        },
    ]
}

const users2 = {
    data: [
        {
            status: "active",
            age: 19,
        },
        {
            status: "inactive",
            age: 43,
        },
        {
            status: "inactive",
            age: 11,
        },
        {
            status: "active",
            age: 11,
        },
        {
            status: "inactive",
            age: 35,
        },
        {
            status: "active",
            age: 18,
        },
    ]
}


//* Observable takes a callback with param as a subscriber
// We emit data inside the callback, also an observable can emit multiple data
const observable = new Observable((subscriber) => {
    // To emit data we do subscriber.next()
    // subscriber.next(10)
    // subscriber.next(11)
    // subscriber.next(12)
    subscriber.next(users)  //* Gets executed
    //subscriber.next(users2) //* Here, we get error, so bottoms don't get executed (avg(age) < 18)
    //subscriber.complete()   //* After this line, none of the bottom line gets executed
    subscriber.next(users)  //* Not executed
    subscriber.next(users)  //* Not executed
    //* Observable sends data to pipe (optional) and the last operator in the pipe sends data to the observer
}).pipe(

    // map((value) => {
    //     console.log("1. Got data from observable ", value)
    //     return value.data
    // }),
    //* pluck gets the data from us and takes the name as a string
    pluck("data"),
    // both pluck and above map works the same
    filter((value) => value.length >= 5),
    //* filter here will only send those "data" ahead to next operator whose length is >= 5
    map((value) => {
        console.log("2. Got data from 1. operator ", value)
        return value.filter(user => user.status === "active")
    }),
    map((value) => {
        console.log("3. Got data from 2. operator ", value)
        return value.reduce((sum, user) => sum + user.age, 0) / value.length
    }),
    map((value) => {
        console.log("4. Got data from 3. operator ", value)
        if (value < 18) {
            // error method gets hit in the observer
            throw new Error("Average age is too young!")
        }
        else return value
    })
)


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