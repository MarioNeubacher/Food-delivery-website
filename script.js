let menus = ['Suppen', 'Salate', 'Sushi', 'Mittagsmenü', 'Alkoholfreie Getränke', 'Alkoholische Getränke'];
let coverimages = ['img/pexels-cats-coming-955137.jpg', 'img/pexels-chan-walrus-1059905.jpg', 'img/pexels-hải-hòa-lê-trần-6144972.jpg', 'img/chinese-geaa0f7553_1920.jpg', 'img/pexels-pixabay-416528.jpg', 'img/pexels-burst-544961.jpg'];
let menus1 = [
    {
        order: 'Hühnersuppe',
        incredients: 'mit Bambus und Pilzen',
        prices: 3.60,
        category: 'Suppen'
    },
    {
        order: 'Meeresfrüchtesuppe',
        incredients: 'mit Shrimps, Tintenfisch und Scholle',
        prices: 4.20,
        category: 'Suppen'
    },
    {
        order: 'Gurkensalat',
        incredients: 'mit Knoblauch (scharf)',
        prices: 3.90,
        category: 'Salate'
    },
    {
        order: 'Gemischter Salat',
        incredients: 'mit Shrimps',
        prices: 4.50,
        category: 'Salate'
    },
    {
        order: 'Nigiri 2 Stk',
        incredients: 'mit Lachs',
        prices: 2.50,
        category: 'Sushi'
    },
    {
        order: 'Maki 8 Stk',
        incredients: 'mit Avocado und Sesam',
        prices: 3.80,
        category: 'Sushi'
    },
    {
        order: 'Schweinefleisch',
        incredients: 'nach Sichuan-Art (scharf)',
        prices: 8.30,
        category: 'Mittagsmenü'
    },
    {
        order: 'Gebratene Reisnudeln',
        incredients: 'mit 3 Sorten Fleisch',
        prices: 9.50,
        category: 'Mittagsmenü'
    },
    {
        order: 'Coca Cola 1,0l',
        prices: 2.90,
        category: 'Alkoholfreie Getränke'
    },
    {
        order: 'Apfelsaft 1,0l',
        prices: 3.30,
        category: 'Alkoholfreie Getränke'
    },
    {
        order: 'Bier Weizen 0,5l',
        prices: 3.00,
        category: 'Alkoholische Getränke'
    },
    {
        order: 'Grüner Veltliner 1/8l',
        prices: 1.80,
        category: 'Alkoholische Getränke'
    }
];

let shoppingBasketMenus = [];

let translatePos = 0;

function render() {
    slider();
    menu();
    loadStorage();
    renderShoppingBasket();
}

/* SLIDER */
function slider() {
    document.getElementById('div-slider').innerHTML = ``;
    for (let i = 0; i < menus.length; i++) {
        const category = menus[i];
        document.getElementById('div-slider').innerHTML += `
            <div style="padding: 0px 20px">
                <a href="#${category}" class="text-navbar">${category}</a>
            </div>
        `;
    }
}

function swipeLeft() {
    if (translatePos < 0) {
        translatePos += 70;
        document.getElementById('div-slider').style.transform = `translate(${translatePos}px, 0)`;
    }
}

function swipeRight() {
    if (translatePos > -280) {
        translatePos -= 70;
        document.getElementById('div-slider').style.transform = `translate(${translatePos}px, 0)`;
    }
}

/* MENU */
function menu() {
    document.getElementById('div-menu').innerHTML = "";
    for (let i = 0; i < menus.length; i++) {
        document.getElementById('div-menu').innerHTML += `
            <img id="${menus[i]}" class="img-meal" src="${coverimages[i]}">
            <div class="div-mealname"><b>${menus[i]}</b></div>
        `;

        let dish = menus1.filter(function (menu) { /* Filter category content */
            return menu['category'] === menus[i];
        }
        )
        dishes(dish);
    }
}

function dishes(dish) {
    for (let i = 0; i < dish.length; i++) {
        document.getElementById('div-menu').innerHTML += `
            <div class="div-meal">
                <img onclick="addToBasket('${dish[i].order}')" class="img-plus" src="img/plus-8-32.png">
                <span class="text-mealheadline">${dish[i]['order']}</span> <span class="text-productinfo">Produktinfo</span>
                <br>
                <div class="text-incredients">${dish[i]['incredients']}</div> <br>
                <span class="text-price">${dish[i]['prices'].toFixed(2).replace(".", ",")} €</span>
            </div>
        `;
    }
}

/* BASKET */
function addToBasket(orderName) {
    let selectedMenu = menus1.find(selectedMenu => selectedMenu.order === orderName);
    let basketMenu = shoppingBasketMenus.find(selectedMenu => selectedMenu.order === orderName);

    if (basketMenu) {
        basketMenu.amount++;
    } else {
        shoppingBasketMenus.push({ order: selectedMenu.order, price: selectedMenu.prices, amount: 1 });
    }

    saveStorage();
    renderShoppingBasket();
}

function renderShoppingBasket() {
    if (shoppingBasketMenus.length == 0) {
        document.getElementById('orders').innerHTML = `
            <div class="div-emptybasket">
                <img class="img-basket" src="img/shopping-basket-48.png">
                <p class="text-basketpreview">Wähle leckere Gerichte aus der Karte und bestelle Dein Menü.</p>
            </div>
            `;

        document.getElementById('pricescalculator').innerHTML = `
            <p>0,00 €</p>
            <p>0,00 €</p>
            <p><b>0,00 €<b></p>
            <br>
            <p id="minimum-price" class="text-basketgreen">0,00 €</p>
            `;
    } else {
        document.getElementById('orders').innerHTML = ``; /* DAMIT SICH SELBE BESTELLUNG ERHÖHT */
        document.getElementById('id-basketResponsiveOrders').innerHTML = ``; 

        let subSum = 0;

        for (let i = 0; i < shoppingBasketMenus.length; i++) {
            const element = shoppingBasketMenus[i];

            const menuTotalPrice = shoppingBasketMenus[i].amount * shoppingBasketMenus[i].price;
            subSum += menuTotalPrice

            document.getElementById('orders').innerHTML += `
                <div class="div-orders">
                    <span>${element.amount}x</span>
                    <div class="div-ordersname">${element['order']}
                    </div>
                    <button onclick="plusBasket(${i})" class="btn-basket">+</button>
                    <button onclick="minusBasket(${i})" class="btn-basket">-</button> 
                    <img class="img-pen" src="img/edit-2-32.png">
                    <span id="increasePrice">${menuTotalPrice.toFixed(2).replace(".", ",")}</span> € <img onclick="deleteOrder(${i})" class="img-trash" src="img/trash-10-32.png">
                    <br>
                </div>
            `;

            document.getElementById('id-basketResponsiveOrders').innerHTML += `
                <div class="div-basketResponsiveMeal">
                    <div>
                        <span>${element.amount}x</span>
                        <span>${element['order']}</span>
                    </div>
                    <div style="display:flex">
                        <button onclick="plusBasket(${i})" class="btn-basket">+</button>
                        <button onclick="minusBasket(${i})" class="btn-basket">-</button>
                        <img class="img-pen" src="img/edit-2-32.png">
                        <div id="increasePrice" style="width: 40px; display:flex; justify-content:flex-end">${menuTotalPrice.toFixed(2).replace(".", ",")}</div> 
                        <img onclick="deleteOrder(${i})" class="img-trash" src="img/trash-10-32.png">
                    </div>
                </div>
            `;
        }
        saveStorage();
        calculator(subSum);
    }
}

function calculator(subtotal) {
    if (subtotal > 0) {
        deliverycosts = '3,99';
        total = subtotal + 3.99;
        minimum = 10 - subtotal;
    } 

    document.getElementById('pricescalculator').innerHTML = `
        <p>${subtotal.toFixed(2).replace(".", ",")} €</p>
        <p>${deliverycosts} €</p>
        <p><b>${total.toFixed(2).replace(".", ",")} €<b></p>
        <br>
        <p id="minimum-price" class="text-basketgreen">${minimum.toFixed(2).replace(".", ",")} €</p>
    `;

    document.getElementById('id-basketResponsive').innerHTML = `
        Warenkorb (${total.toFixed(2).replace(".", ",")} €)
    `;

    document.getElementById('id-calculatorResponsive').innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: flex-end">
            <p style="padding: 5px">${subtotal.toFixed(2).replace(".", ",")} €</p>
            <p style="padding: 5px">${deliverycosts} €</p>
            <p style="padding: 5px"><b>${total.toFixed(2).replace(".", ",")} €<b></p>
            <p id="minimum-price1" class="text-basketgreen">${minimum.toFixed(2).replace(".", ",")} €</p>
        </div>
    `;

    if (minimum < 0) {
        document.getElementById('text-minimum').innerHTML = `Mindestbestellwert erreicht!`;
        document.getElementById('text-minimum1').innerHTML = `Mindestbestellwert erreicht!`;
        document.getElementById('minimum-price').innerHTML = ``;
        document.getElementById('minimum-price1').innerHTML = ``;
        document.getElementById('div-minimum').innerHTML = `
            <div id="btn-order" class="btn-order btn-ordergreen">
                <p onclick="alertOrder()">Bestellen</p>
            </div>
        `;
        document.getElementById('text2-minimum').innerHTML = ``;
        document.getElementById('pricescalculator').classList.add('div-pricesspace');
        document.getElementById('btn-order1').innerHTML = `
            <div onclick="alertOrder()" class="btn-orderResponsiveEnable">
                Bestellen
            </div>
        `;
        } else {
        document.getElementById('text-minimum').innerHTML = `Benötigter Betrag, um den <br>Mindestbestellwert zu erreichen:`;
        document.getElementById('text-minimum1').innerHTML = `Benötigter Betrag, um den <br>Mindestbestellwert zu erreichen:`;
        document.getElementById('div-minimum').innerHTML = `
            <p class="text-orderinfo">Leider kannst du noch nichts bestellen. <br>Hangry Dragon liefert erst ab einem
            <br>Mindestbestellwert von 10,00 € (exkl. Lieferkosten).</p>
            <div id="btn-order" class="btn-order">
                Bestellen
            </div>
        `;
        document.getElementById('text2-minimum').innerHTML = `
            <p class="text-orderinfo">
                Leider kannst du noch nichts bestellen. <br>Hangry Dragon
                liefert erst ab einem Mindestbestellwert von 10,00 € (exkl. Lieferkosten).
            </p>
            `;
        document.getElementById('pricescalculator').classList.remove('div-pricesspace');
        document.getElementById('btn-order1').innerHTML = `
            <div class="btn-orderResponsive">
                Bestellen
            </div>
        `;}

    saveStorage();
}

function alertOrder() {
    alert('Bestellt!');
}

function plusBasket(i) {
    shoppingBasketMenus[i].amount++;
    saveStorage();
    renderShoppingBasket();
}

function minusBasket(i) {
    if (shoppingBasketMenus[i].amount >= 2) {
        shoppingBasketMenus[i].amount--;
    } else {
        shoppingBasketMenus.splice(i, 1);
    }

    if (shoppingBasketMenus.length == 0) {
        document.getElementById('id-basketResponsive').innerHTML = `
            Warenkorb (0,00 €)
    `;
    }

    if (shoppingBasketMenus.length == 0) {
        closeWindow();
    }

    saveStorage();
    renderShoppingBasket();
}

function deleteOrder(i) {
    shoppingBasketMenus.splice(i, 1);

    if (shoppingBasketMenus.length == 0) {
        document.getElementById('id-basketResponsive').innerHTML = `
            Warenkorb (0,00 €)
        `;
    }

    if (shoppingBasketMenus.length == 0) {
        closeWindow();
    }

    saveStorage();
    renderShoppingBasket();
}

/* BASKET SCROLLABLE */
window.onscroll = stickyBasket;

function stickyBasket() {
    document.getElementById('basket').style.top = Math.max(0, 75 - window.pageYOffset) + 'px';
    showBtn();
}

/* BTN SCROLL TO TOP */
function showBtn() {
    if (document.body.scrollTop > 75 || document.documentElement.scrollTop > 75) {
        document.getElementById('id-scollToTop').classList.remove('d-none');
    } else {
        document.getElementById('id-scollToTop').classList.add('d-none');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    })
}

/* LOCAL STORAGE */
function saveStorage() {
    let BasketAsText = JSON.stringify(shoppingBasketMenus);

    localStorage.setItem('keyBasket', BasketAsText);
}

function loadStorage() {
    let BasketAsText = localStorage.getItem('keyBasket');
    if (BasketAsText) {
        shoppingBasketMenus = JSON.parse(BasketAsText); /* von Text in Array */
    }
}

/* BASKET RESPONSIVE */
function basketResponsive() {
    if (shoppingBasketMenus.length > 0) {
        document.getElementById('id-basketResponsiveFullscreen').classList.remove('d-none');
        document.getElementById('id-body').classList.add('stop-scroll');
    } 
}

function closeWindow() {
    document.getElementById('id-basketResponsiveFullscreen').classList.add('d-none');
    document.getElementById('id-body').classList.remove('stop-scroll');
}