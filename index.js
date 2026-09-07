import {menuArray} from './data.js'


document.addEventListener('click', handleClicks)

const orderArray = []

const paymentModal = document.getElementById('payment-modal')
const paymentForm = document.getElementById('payment-form')
const checkoutContainer = document.getElementById('checkout')
const completeMessage = document.getElementById('complete-message')

const nameInput = document.getElementById('full-name')
const thankYouMessage = document.getElementById('thank-you-message')

paymentForm.addEventListener('submit', handlePaymentSubmit)


//"Browser, don't perform the form's normal submission behavior" - What it does
function handlePaymentSubmit(event){
    event.preventDefault()

     const name = nameInput.value

    paymentModal.style.display = 'none'
    checkoutContainer.style.display = 'none'


    thankYouMessage.textContent = `Thanks, ${name}! Your order is on its way!`
    completeMessage.style.display = 'flex'


}



//Finds which menu item was added by comparing their ids.
function handleClicks(event){
    if(event.target.classList.contains('add-btn')){

        const itemId = event.target.dataset.id

        const menuItem = menuArray.find((item) => {
            return item.id == itemId
        })
        

        const existingItem = orderArray.find((item) => {
            return item.id == itemId
        })


        if(existingItem){
            existingItem.quantity++ 
        } else {
            orderArray.push({
                ...menuItem,
                quantity:1,
                existingPrice: menuItem.price
            })
            
        }

        render()
    }

    if(event.target.classList.contains('remove-btn')){
        const removeItemId = event.target.dataset.removeId

        const existingItemIndex = orderArray.findIndex((item) => {
            return item.id == removeItemId
        })

        if(existingItemIndex === -1){
            return
        }

        const existingItem = orderArray[existingItemIndex]

       if(existingItem.quantity > 1){
            existingItem.quantity--
        } else {
            orderArray.splice(existingItemIndex, 1)
        }



        render()


    }

    if(event.target.classList.contains('checkout-button')){
        paymentModal.style.display = 'flex'
    }

}

//responsible for displaying the order items
function getOrderHtml(){

    if (orderArray.length === 0) {
        return ``
    }

    let orderItemsHtml = ``

    orderArray.forEach((orderItem) =>{
        orderItemsHtml +=`
        <div class="order">
            <div class="name-quantity-container">
                <p class="item-name">${orderItem.name}</p>
                <p class="item-quantity">x${orderItem.quantity}</p>
            </div>

            <button class="remove-btn" data-remove-id="${orderItem.id}">Remove</button>
            
            <p class="price">$${orderItem.price * orderItem.quantity}</p>
        </div>
        `
    })

    const totalPrice = orderArray.reduce((total, orderItem) => {
        return total + orderItem.price * orderItem.quantity
    }, 0)


    return `
        <div class="checkout-title">
             <h2>Your order</h2>
        </div>

         <div class="checkout-items">
            ${orderItemsHtml}

            <div class="checkout-divider"></div>
            
        </div>


        <div class="checkout-total">
            Total Price: 
            <div class="totalPrice">$${totalPrice}</div>
        </div>

        <div class="checkout-button-container">
            <button class="checkout-button" id="checkout-button">Complete order</button>
        </div>
        
    
    `
}



//Html for all the menu items which later gets rendered by the render() function
function getMenuHtml(){

    let menuHtml = `` 

    menuArray.forEach((menuItem) =>{

        const {name, ingredients, id, price, emoji} = menuItem

        menuHtml += `
            <div class="item" id="${id}">
                <div class="emoji">
                    <p>${emoji}</p>
                </div>
                
                <div class="text">
                    <p class="title">${name} </p>
                    <p class="description">${ingredients.join(", ")}</p>
                    <p class="price">$${price}</p>
                </div>

                <button class="add-btn" data-id="${id}">+</button>

            </div>

            <div class="divider"></div>

        
        `
        })
        return menuHtml

}

function render(){
    document.getElementById('menu-items').innerHTML = getMenuHtml()
    document.getElementById('checkout').innerHTML = getOrderHtml()
}

render()


