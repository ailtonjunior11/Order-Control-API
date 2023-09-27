const express = require('express')
const uuid = require('uuid')

const port = 3001
const app = express()
app.use(express.json())

const orders = []


const checkMethodAndUrl = (request, response, next) => {
    const methodAndUrl = {
        method: request.method,
        Url: request.url
    }

    console.log(methodAndUrl);
    next()
}


const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex((order) => order.id === id)

    if (index < 0) {

        return response.status(404).json({ error: "User not found" })
    }

    request.ordersIndex = index
    request.ordersId = id

    next()
}

app.get('/orders', checkMethodAndUrl, (request, response) => {
    return response.json(orders)
})

app.get('/orders/:id', checkMethodAndUrl, checkOrderId, (request, response) => {
    const index = request.orderIndex
    const orderId = orders[index]

    return response.json(orderId)

})

app.post('/orders', checkMethodAndUrl, (request, response) => {
    const { order, clientName, price, status } = request.body

    const orderClient = { id: uuid.v4(), order, clientName, price, status }

    orders.push(orderClient)

    return response.status(201).json(orderClient)
})


app.put('/orders/:id', checkMethodAndUrl, checkOrderId, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return response.json(updateOrder)
})


app.patch('/orders/:id', checkMethodAndUrl, checkOrderId, (request, response) => {
    const index = request.ordersIndex
    const { id, order, clientName, price } = orders[index]
    let status = orders[index].status
    status = "Pronto"
    const finisheOrder = { id, order, clientName, price, status }

    orders[index] = finisheOrder


    return response.json(finisheOrder)
})

app.delete('/orders/:id', checkMethodAndUrl, checkOrderId, (request, response) => {
    const index = request.ordersIndex
    

    orders.splice(index, 1)

    return response.status(204).json()
})




app.listen(port, () => {
    console.log(`🚀💻🚀💻 Sever started on port ${port}`)
})