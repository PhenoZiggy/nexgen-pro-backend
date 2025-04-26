import Orders from '../models/orders';
import Products from "../models/products";

export const createOrder = async (req, res) => {
    const {userId, items, userData} = req.body;

    await Orders.create({
        userId,
        items,
        userData,
    })
        .then((order) => {
            res.status(201).json(order);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
};

export const retrieveUserOrders = async (req, res) => {
    const userId = req.userId;
    const filter = {userId: userId};
    await Orders.find(filter)
    .then((response) => {

        const newOrderRes = []

        const promises = response.map(async (singleOrder, index) => {
            let products = []
            let productsIds = []

            singleOrder.items.map((singleItem) => {
                productsIds.push(singleItem.id)
            })

            const promises = productsIds.map(async (singleId) => {
                return await Products.findById(singleId)
            })


            await Promise.all(promises).then((response) => {
                products = response

                const productsWithAmount = products.map((singleProduct, index) => {
                    if (singleProduct && singleProduct._doc) {
                        const singleProductWithQuantity = {
                            ...singleProduct._doc,
                            amount: singleOrder.items[index].amount
                        }
                        return singleProductWithQuantity
                    }


                })

                newOrderRes.push({
                    ...singleOrder._doc,
                    productsWithAmount,
                })
            })

        })

        Promise.all(promises).then((response) => {
            res.status(200).json(newOrderRes);
        })

    })
    .catch((err) => {
        res.status(500).json(err);
    });
};

export const updateOrderStatus = async (req, res) => {
    const {id, status} = req.body;
    const filter = {_id: id};
    const update = {
        orderStatus: status,
    };
    await Orders.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true, // Make this update into an upsert
    })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(401).json({error: err});
        });
};

export const getAll = async (req, res) => {
    await Orders.find()
        .then((response) => {

            const newOrderRes = []

            const promises = response.map(async (singleOrder, index) => {
                let products = []
                let productsIds = []

                singleOrder.items.map((singleItem) => {
                    productsIds.push(singleItem.id)
                })

                const promises = productsIds.map(async (singleId) => {
                    return await Products.findById(singleId)
                })


                await Promise.all(promises).then((response) => {
                    products = response

                    const productsWithAmount = products.map((singleProduct, index) => {
                        if (singleProduct && singleProduct._doc) {
                            const singleProductWithQuantity = {
                                ...singleProduct._doc,
                                amount: singleOrder.items[index].amount
                            }
                            return singleProductWithQuantity
                        }


                    })

                    newOrderRes.push({
                        ...singleOrder._doc,
                        productsWithAmount,
                    })
                })

            })

            Promise.all(promises).then((response) => {
                res.status(200).json(newOrderRes);
            })

        })
        .catch((err) => {
            res.status(500).json(err);
        });
};
